import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import type { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import type { Mock } from 'vitest';
import { handler, IEvent } from '../delete-records';

describe('delete-records', () => {
  let callback: Mock;
  let context: Context;
  let ddb: AwsClientStub<DynamoDBClient>;
  let event: IEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = vi.fn();

    ddb = mockClient(DynamoDBClient);
    ddb.on(BatchWriteCommand).resolves({});

    event = {
      complete: true,
      id: 'company-id',
      items: ['client-id-1', 'client-id-2'],
      owner: 'owner-id',
    };
  });

  it('should throw if no table is set', async () => {
    await expect(handler(event, context, callback)).rejects.toThrow(
      'No table set',
    );
  });

  describe('with a table set', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.TABLE = 'app-table';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should throw if no typename set is set', async () => {
      await expect(handler(event, context, callback)).rejects.toThrow(
        'No typename set',
      );
    });
  });

  describe('with a table and typename set', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.TABLE = 'app-table';
      process.env.TYPENAME = 'Client';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should call batchWrite with no more than 25 delete requests', async () => {
      await handler(event, context, callback);

      expect(ddb).toReceiveCommandWith(BatchWriteCommand, {
        RequestItems: {
          'app-table': [
            {
              DeleteRequest: {
                Key: {
                  __typename: 'Client',
                  id: 'client-id-1',
                },
              },
            },
            {
              DeleteRequest: {
                Key: {
                  __typename: 'Client',
                  id: 'client-id-2',
                },
              },
            },
          ],
        },
      });
    });

    it('should delete creation receipts by their table typename', async () => {
      process.env.TYPENAME = 'TransactionCreationReceipt';
      event.items = ['transaction-creation:receipt-id'];

      await handler(event, context, callback);

      const requests = ddb
        .commandCalls(BatchWriteCommand)
        .map(({ args }) => args[0].input.RequestItems?.['app-table'] ?? []);

      expect(requests).toEqual([
        [
          {
            DeleteRequest: {
              Key: {
                __typename: 'TransactionCreationReceipt',
                id: 'transaction-creation:receipt-id',
              },
            },
          },
        ],
        [
          {
            DeleteRequest: {
              Key: {
                __typename:
                  'TransactionCreationReceiptIndex:transaction-creation:receipt-id',
                id: 'company-id',
              },
            },
          },
        ],
      ]);
    });

    it('does not delete receipt index records when a receipt batch fails', async () => {
      process.env.TYPENAME = 'TransactionCreationReceipt';
      event.items = Array.from(
        { length: 26 },
        (_, index) => `transaction-creation:receipt-${index}`,
      );
      ddb
        .on(BatchWriteCommand)
        .resolvesOnce({})
        .rejectsOnce(new Error('receipt batch failed'));

      await expect(handler(event, context, callback)).rejects.toThrow(
        'receipt batch failed',
      );

      const requests = ddb
        .commandCalls(BatchWriteCommand)
        .map(({ args }) => args[0].input.RequestItems?.['app-table'] ?? []);

      expect(requests).toHaveLength(2);
      expect(
        requests.flat().every(({ DeleteRequest }) => {
          const { __typename: typeName } = DeleteRequest?.Key ?? {};

          return typeName === 'TransactionCreationReceipt';
        }),
      ).toBe(true);
    });

    it('restarts receipt cleanup before deleting company lookup records', async () => {
      process.env.TYPENAME = 'TransactionCreationReceipt';
      event.items = Array.from(
        { length: 26 },
        (_, index) => `transaction-creation:receipt-${index}`,
      );
      ddb
        .on(BatchWriteCommand)
        .resolvesOnce({})
        .rejectsOnce(new Error('receipt batch failed'))
        .resolves({});

      await expect(handler(event, context, callback)).rejects.toThrow(
        'receipt batch failed',
      );
      await handler(event, context, callback);

      const requests = ddb
        .commandCalls(BatchWriteCommand)
        .map(({ args }) => args[0].input.RequestItems?.['app-table'] ?? []);
      const typeNames: unknown[][] = requests.map((batch) =>
        batch.map(({ DeleteRequest }) => {
          const { __typename: typeName } = DeleteRequest?.Key ?? {};

          return typeName as unknown;
        }),
      );

      expect(
        typeNames
          .slice(0, 4)
          .flat()
          .every((typeName) => typeName === 'TransactionCreationReceipt'),
      ).toBe(true);
      expect(typeNames.slice(4).flat()).toEqual([
        ...Array.from(
          { length: 25 },
          (_, index) =>
            `TransactionCreationReceiptIndex:transaction-creation:receipt-${index}`,
        ),
        'TransactionCreationReceiptIndex:transaction-creation:receipt-25',
      ]);
    });

    it('should preserve a continuation key until the page has been deleted', async () => {
      event.complete = false;
      event.lastEvaluatedKey = {
        __typename: 'Client',
        data: 'owner-id:company-id:next',
        id: 'last-id',
      };

      await expect(handler(event, context, callback)).resolves.toEqual({
        ...event,
        complete: false,
      });
    });

    it('should split a page across sequential batches of at most 25 deletes', async () => {
      event.items = Array.from({ length: 51 }, (_, index) => `client-${index}`);

      await handler(event, context, callback);

      const requests = ddb
        .commandCalls(BatchWriteCommand)
        .map(({ args }) => args[0].input.RequestItems?.['app-table'] ?? []);

      expect(requests.map((batch) => batch.length)).toEqual([25, 25, 1]);
      expect(requests[0]?.[0]).toEqual({
        DeleteRequest: {
          Key: {
            __typename: 'Client',
            id: 'client-0',
          },
        },
      });
      expect(requests[1]?.[0]).toEqual({
        DeleteRequest: {
          Key: {
            __typename: 'Client',
            id: 'client-25',
          },
        },
      });
      expect(requests[2]?.[0]).toEqual({
        DeleteRequest: {
          Key: {
            __typename: 'Client',
            id: 'client-50',
          },
        },
      });
    });

    it('should not advance the page when a later batch fails', async () => {
      event.complete = false;
      event.lastEvaluatedKey = {
        __typename: 'Client',
        data: 'owner-id:company-id:next',
        id: 'last-id',
      };
      event.items = Array.from({ length: 51 }, (_, index) => `client-${index}`);
      ddb
        .on(BatchWriteCommand)
        .resolvesOnce({})
        .rejectsOnce(new Error('second batch failed'));

      await expect(handler(event, context, callback)).rejects.toThrow(
        'second batch failed',
      );

      const requests = ddb
        .commandCalls(BatchWriteCommand)
        .map(({ args }) => args[0].input.RequestItems?.['app-table'] ?? []);

      expect(requests.map((batch) => batch.length)).toEqual([25, 25]);
      expect(requests[1]?.[0]).toEqual({
        DeleteRequest: {
          Key: {
            __typename: 'Client',
            id: 'client-25',
          },
        },
      });
    });

    it('should retry only unprocessed items with bounded backoff', async () => {
      const unprocessedItems = {
        'app-table': [
          {
            DeleteRequest: {
              Key: {
                __typename: 'Client',
                id: 'client-id-1',
              },
            },
          },
        ],
      };
      ddb
        .on(BatchWriteCommand)
        .resolvesOnce({
          UnprocessedItems: unprocessedItems,
        })
        .resolves({
          UnprocessedItems: {},
        });

      await expect(handler(event, context, callback)).resolves.toEqual({
        ...event,
        complete: true,
      });

      expect(ddb).toReceiveCommandTimes(BatchWriteCommand, 2);
      expect(ddb.commandCalls(BatchWriteCommand)[1].args[0].input).toEqual({
        RequestItems: unprocessedItems,
      });
    });

    it('should fail when unprocessed items remain after the retry limit', async () => {
      const unprocessedItems = {
        'app-table': [
          {
            DeleteRequest: {
              Key: {
                __typename: 'Client',
                id: 'client-id-1',
              },
            },
          },
        ],
      };
      ddb.on(BatchWriteCommand).resolves({
        UnprocessedItems: unprocessedItems,
      });

      await expect(handler(event, context, callback)).rejects.toThrow(
        'BatchWrite still has unprocessed items after 5 attempts',
      );

      expect(ddb).toReceiveCommandTimes(BatchWriteCommand, 5);
    });

    it('should reject a batch larger than the DynamoDB limit', async () => {
      event.items = Array.from(
        { length: 101 },
        (_, index) => `client-${index}`,
      );

      await expect(handler(event, context, callback)).rejects.toThrow(
        'Cannot delete more than 100 records in one page',
      );

      expect(ddb).toReceiveCommandTimes(BatchWriteCommand, 0);
    });
  });
});
