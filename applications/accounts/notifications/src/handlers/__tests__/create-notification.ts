import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { captureException } from '@sentry/aws-serverless';
import type { APIGatewayProxyEvent, Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import type { Mock } from 'vitest';
import { handler } from '../create-notification';

vi.mock('@sentry/aws-serverless', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@sentry/aws-serverless')>()),
  captureException: vi.fn(),
}));

describe('create-notification', () => {
  let callback: Mock;
  let context: Context;
  let ddb: AwsClientStub<DynamoDBClient>;
  let env: NodeJS.ProcessEnv;
  let event: APIGatewayProxyEvent;

  beforeAll(() => {
    vi.setSystemTime(new Date('2021-04-11T19:45:00+00:00'));
  });

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = vi.fn();

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

  afterAll(() => {
    vi.useRealTimers();
  });

  it('should return a 201 when a notification is created', async () => {
    await expect(handler(event, context, callback)).resolves.toEqual({
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

    await expect(handler(event, context, callback)).resolves.toEqual({
      body: JSON.stringify({
        message: 'Invalid request',
        statusCode: 400,
      }),
      statusCode: 400,
    });
  });

  it('should return a 400 response if the body is not valid JSON', async () => {
    event.body = '{';

    await expect(handler(event, context, callback)).resolves.toEqual({
      body: JSON.stringify({
        message: 'Invalid request',
        statusCode: 400,
      }),
      statusCode: 400,
    });
  });

  it('should report a 500 response if the database write fails', async () => {
    const error = new Error('Database unavailable');

    vi.spyOn(console, 'error').mockImplementation(() => {});
    ddb.on(PutCommand).rejects(error);

    await expect(handler(event, context, callback)).resolves.toMatchObject({
      statusCode: 500,
    });
    expect(captureException).toHaveBeenCalledWith(error);
  });
});
