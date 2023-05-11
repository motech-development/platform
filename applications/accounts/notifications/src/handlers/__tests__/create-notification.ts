import {
  DynamoDBClient,
  ServiceInputTypes,
  ServiceOutputTypes,
} from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { AwsStub, mockClient } from 'aws-sdk-client-mock';
import { advanceTo, clear } from 'jest-date-mock';
import { handler } from '../create-notification';

describe('create-notification', () => {
  let callback: jest.Mock;
  let context: Context;
  let ddb: AwsStub<ServiceInputTypes, ServiceOutputTypes>;
  let env: NodeJS.ProcessEnv;
  let event: APIGatewayProxyEvent;

  beforeAll(() => {
    advanceTo('2021-04-11T19:45:00+00:00');
  });

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();

    ddb = mockClient(DynamoDBClient);

    event = {
      body: JSON.stringify({
        message: 'MY_MESSAGE_CODE',
        owner: 'OWNER-ID',
        payload: 'id=1&owner=me',
      }),
    } as APIGatewayProxyEvent;

    env = {
      ...process.env,
    };

    process.env.TABLE = 'TABLE-NAME';
  });

  afterEach(() => {
    process.env = env;
  });

  afterAll(clear);

  it('should return a 201 when a notification is created', async () => {
    await handler(event, context, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      body: '',
      statusCode: 201,
    });
  });

  it('should write to the database with the correct params', async () => {
    await handler(event, context, callback);

    expect(ddb).toReceiveCommandWith(PutCommand, {
      Item: {
        __typename: 'Notification',
        createdAt: '2021-04-11T19:45:00.000Z',
        data: 'OWNER-ID:Notification:2021-04-11T19:45:00.000Z',
        id: 'test-uuid',
        message: 'MY_MESSAGE_CODE',
        owner: 'OWNER-ID',
        payload: 'id=1&owner=me',
        read: false,
      },
      TableName: 'TABLE-NAME',
    });
  });

  it('should return a 400 response if the request fails', async () => {
    event = {
      body: JSON.stringify({
        message: 'MY_MESSAGE_CODE',
      }),
    } as APIGatewayProxyEvent;

    await handler(event, context, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      body: JSON.stringify({
        message: 'Invalid request',
        statusCode: 400,
      }),
      statusCode: 400,
    });
  });
});
