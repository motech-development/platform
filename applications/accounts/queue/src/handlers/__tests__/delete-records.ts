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
      event.items = Array.from({ length: 26 }, (_, index) => `client-${index}`);

      await expect(handler(event, context, callback)).rejects.toThrow(
        'Cannot delete more than 25 records in one batch',
      );

      expect(ddb).toReceiveCommandTimes(BatchWriteCommand, 0);
    });
  });
});
