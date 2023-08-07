import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import { handler } from '../get-banks';

describe('get-banks', () => {
  let callback: jest.Mock;
  let context: Context;
  let dynamodb: AwsClientStub<DynamoDBClient>;
  let event: APIGatewayProxyEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();

    dynamodb = mockClient(DynamoDBClient);

    event = {} as APIGatewayProxyEvent;
  });

  it('should return an error if table is not set', async () => {
    await handler(event, context, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      body: JSON.stringify({
        message: 'No table set',
        statusCode: 400,
      }),
      statusCode: 400,
    });
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

    it('should return a list of banks', async () => {
      dynamodb.on(QueryCommand).resolves({
        Items: [
          {
            name: 'bank-1',
            pk: '1',
          },
          {
            name: 'bank-2',
            pk: '2',
          },
          {
            name: 'bank-3',
            pk: '3',
          },
        ],
      });

      await handler(event, context, callback);

      expect(callback).toHaveBeenCalledWith(null, {
        body: JSON.stringify({
          items: [
            {
              id: '1',
              name: 'bank-1',
            },
            {
              id: '2',
              name: 'bank-2',
            },
            {
              id: '3',
              name: 'bank-3',
            },
          ],
        }),
        statusCode: 200,
      });
    });

    it('should return an empty array if no banks are available', async () => {
      dynamodb.on(QueryCommand).resolves({});

      await handler(event, context, callback);

      expect(callback).toHaveBeenCalledWith(null, {
        body: JSON.stringify({
          items: [],
        }),
        statusCode: 200,
      });
    });
  });
});
