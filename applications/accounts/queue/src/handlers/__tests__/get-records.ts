import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import type { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import type { Mock } from 'vitest';
import { handler, IEvent, IOutput } from '../get-records';

describe('get-records', () => {
  let callback: Mock;
  let context: Context;
  let ddb: AwsClientStub<DynamoDBClient>;
  let event: IEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = vi.fn();

    ddb = mockClient(DynamoDBClient);

    event = {
      id: 'company-id',
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

    describe('when clients are returned', () => {
      let Items: string[];

      beforeEach(() => {
        Items = [...new Array<unknown>(50)].map((_, i) => `client-id-${i}`);

        ddb.on(QueryCommand).resolves({
          Items: Items.slice(0, 25).map((id) => ({
            id,
          })),
        });
      });

      it('should query one bounded page with the correct params', async () => {
        await handler(event, context, callback);

        expect(ddb).toReceiveCommandWith(QueryCommand, {
          ExpressionAttributeNames: {
            '#data': 'data',
            '#owner': 'owner',
            '#typename': '__typename',
          },
          ExpressionAttributeValues: {
            ':data': 'owner-id:company-id',
            ':owner': 'owner-id',
            ':typename': 'Client',
          },
          FilterExpression: '#owner = :owner',
          IndexName: '__typename-data-index',
          KeyConditionExpression:
            '#typename = :typename AND begins_with(#data, :data)',
          Limit: 100,
          ProjectionExpression: 'id',
          TableName: 'app-table',
        });
      });

      it('should strongly query company receipt index records from the table', async () => {
        process.env.TYPENAME = 'TransactionCreationReceipt';
        ddb.on(QueryCommand).resolves({
          Items: [
            {
              __typename:
                'TransactionCreationReceiptIndex:transaction-creation:receipt-id',
              id: 'company-id',
              owner: 'owner-id',
            },
          ],
        });

        await expect(handler(event, context, callback)).resolves.toMatchObject({
          complete: true,
          id: 'company-id',
          items: ['transaction-creation:receipt-id'],
          owner: 'owner-id',
        });

        expect(ddb).toReceiveCommandWith(QueryCommand, {
          ConsistentRead: true,
          ExpressionAttributeNames: {
            '#id': 'id',
            '#owner': 'owner',
            '#typename': '__typename',
          },
          ExpressionAttributeValues: {
            ':id': 'company-id',
            ':owner': 'owner-id',
            ':typename': 'TransactionCreationReceiptIndex:',
          },
          FilterExpression: '#owner = :owner',
          KeyConditionExpression:
            '#id = :id AND begins_with(#typename, :typename)',
          Limit: 100,
          ProjectionExpression: '#typename, #owner',
          TableName: 'app-table',
        });
        expect(
          ddb.commandCalls(QueryCommand)[0].args[0].input,
        ).not.toHaveProperty('IndexName');
      });

      it('ignores receipt lookup records owned by another user', async () => {
        process.env.TYPENAME = 'TransactionCreationReceipt';
        ddb.on(QueryCommand).resolves({
          Items: [
            {
              __typename:
                'TransactionCreationReceiptIndex:transaction-creation:other-receipt',
              id: 'company-id',
              owner: 'other-owner',
            },
          ],
        });

        await expect(handler(event, context, callback)).resolves.toMatchObject({
          complete: true,
          items: [],
        });
      });

      it('reduces an oversized page and preserves the matching continuation key', async () => {
        const oversizedId = '\\'.repeat(2048);
        const continuationKey = (id: string) => ({
          __typename: 'Client',
          data: 'owner-id:company-id:next',
          id,
        });

        ddb
          .on(QueryCommand)
          .resolvesOnce({
            Items: Array.from({ length: 100 }, () => ({ id: oversizedId })),
            LastEvaluatedKey: continuationKey('after-100'),
          })
          .resolvesOnce({
            Items: Array.from({ length: 50 }, () => ({ id: oversizedId })),
            LastEvaluatedKey: continuationKey('after-50'),
          })
          .resolvesOnce({
            Items: Array.from({ length: 25 }, () => ({ id: oversizedId })),
            LastEvaluatedKey: continuationKey('after-25'),
          });

        const result = await handler(event, context, callback);
        const queryLimits = ddb
          .commandCalls(QueryCommand)
          .map(({ args }) => args[0].input.Limit);

        expect(queryLimits).toEqual([100, 50, 25]);
        if (!result) {
          throw new Error('Expected a deletion page result');
        }

        expect(result.items).toHaveLength(25);
        expect(result.lastEvaluatedKey).toEqual(continuationKey('after-25'));
        expect(Buffer.byteLength(JSON.stringify(result))).toBeLessThan(
          192 * 1024,
        );
      });

      it('should return the first page and its continuation key', async () => {
        const lastEvaluatedKey = {
          __typename: 'Client',
          data: 'owner-id:company-id:next',
          id: 'last-id',
        };
        ddb.on(QueryCommand).resolves({
          Items: Items.slice(0, 25).map((id) => ({
            id,
          })),
          LastEvaluatedKey: lastEvaluatedKey,
        });

        const result = await handler(event, context, callback);

        expect(result).toEqual({
          complete: false,
          id: 'company-id',
          items: Items.slice(0, 25),
          lastEvaluatedKey,
          owner: 'owner-id',
        });
      });

      it('should pass the continuation key and preserve an empty page', async () => {
        const lastEvaluatedKey = {
          __typename: 'Client',
          data: 'owner-id:company-id:next',
          id: 'last-id',
        };
        event.lastEvaluatedKey = lastEvaluatedKey;
        ddb.on(QueryCommand).resolves({
          Items: [],
          LastEvaluatedKey: lastEvaluatedKey,
        });

        await expect(handler(event, context, callback)).resolves.toEqual({
          complete: false,
          id: 'company-id',
          items: [],
          lastEvaluatedKey,
          owner: 'owner-id',
        } satisfies IOutput);

        expect(ddb).toReceiveCommandWith(QueryCommand, {
          ExclusiveStartKey: lastEvaluatedKey,
        });
      });
    });

    describe('when clients are not returned', () => {
      beforeEach(() => {
        ddb.on(QueryCommand).resolves({
          Items: [],
          LastEvaluatedKey: {},
        });
      });

      it('should treat an empty continuation key as complete', async () => {
        event.lastEvaluatedKey = {};

        await expect(handler(event, context, callback)).resolves.toEqual({
          complete: true,
          id: 'company-id',
          items: [],
          owner: 'owner-id',
        });

        expect(
          ddb.commandCalls(QueryCommand)[0].args[0].input,
        ).not.toHaveProperty('ExclusiveStartKey');
      });
    });
  });
});
