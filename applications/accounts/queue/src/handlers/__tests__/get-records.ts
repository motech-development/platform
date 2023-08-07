import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import chunk from '../../shared/chunk';
import { handler, IEvent } from '../get-records';

describe('get-records', () => {
  let callback: jest.Mock;
  let context: Context;
  let ddb: AwsClientStub<DynamoDBClient>;
  let event: IEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();

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
          Items: Items.map((id) => ({
            id,
          })),
        });
      });

      it('should query with the correct params', async () => {
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
          ProjectionExpression: 'id',
          TableName: 'app-table',
        });
      });

      it('should not complete', async () => {
        const items = chunk(Items, 25);

        await expect(handler(event, context, callback)).resolves.toEqual({
          complete: false,
          count: items.length,
          current: 0,
          items,
        });
      });
    });

    describe('when clients are not returned', () => {
      beforeEach(() => {
        ddb.on(QueryCommand).resolves({
          Items: [],
        });
      });

      it('should complete', async () => {
        await expect(handler(event, context, callback)).resolves.toEqual({
          complete: true,
        });
      });
    });
  });
});
