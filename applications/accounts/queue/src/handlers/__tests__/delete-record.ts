import {
  DynamoDBClient,
  ServiceInputTypes,
  ServiceOutputTypes,
} from '@aws-sdk/client-dynamodb';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { AwsStub, mockClient } from 'aws-sdk-client-mock';
import { handler, IEvent } from '../delete-record';

describe('delete-record', () => {
  let callback: jest.Mock;
  let context: Context;
  let ddb: AwsStub<ServiceInputTypes, ServiceOutputTypes>;
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
      process.env.TYPENAME = 'Settings';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should delete with the correct params', async () => {
      await handler(event, context, callback);

      expect(ddb).toReceiveCommandWith(DeleteCommand, {
        ConditionExpression: '#owner = :owner',
        ExpressionAttributeNames: {
          '#owner': 'owner',
        },
        ExpressionAttributeValues: {
          ':owner': 'owner-id',
        },
        Key: {
          __typename: 'Settings',
          id: 'company-id',
        },
        TableName: 'app-table',
      });
    });

    it('should complete', async () => {
      await expect(handler(event, context, callback)).resolves.toEqual({
        complete: true,
      });
    });
  });
});
