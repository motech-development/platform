import { readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import logger from '@motech-development/node-logger';
import { AWSAppSyncClient } from 'aws-appsync';
import type { Callback, Context, DynamoDBStreamEvent } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import type { Mock } from 'vitest';
import { handler, mutation } from '../publish-notifications';

const validNotificationResponse = {
  data: {
    notificationBeacon: {
      createdAt: 'today',
      id: 'notification-id',
      message: 'Notification message',
      owner: 'owner-id',
      payload: 'id=1&owner=me',
      read: false,
    },
  },
};

describe('publish-notifications', () => {
  let callback: Callback;
  let context: Context;
  let event: DynamoDBStreamEvent;
  let env: NodeJS.ProcessEnv;

  it('uses AppSync JSON serialization for notification inputs with special payloads', async () => {
    const responseTemplate = await readFile(
      join(
        process.cwd(),
        'mapping-templates/notifications/notificationBeacon/Mutation.notificationBeacon.res.vtl',
      ),
      'utf8',
    );
    const inputs = [
      {
        createdAt: 'today',
        id: 'notification-id',
        message: 'Notification message',
        owner: 'owner-id',
        payload: '{"title":"quoted"\n"line"}',
        read: false,
      },
      {
        createdAt: 'today',
        id: 'notification-id',
        message: 'Notification message',
        owner: 'owner-id',
        payload: null,
        read: false,
      },
    ];

    expect(responseTemplate.trim()).toBe('$util.toJson($ctx.arguments.input)');
    inputs.forEach((input) => {
      expect(JSON.parse(JSON.stringify(input))).toEqual(input);
    });
  });

  it('configures partial batch responses for the stream event source', () => {
    const serverlessConfig = readFileSync('serverless.yml', 'utf8');
    const publishNotificationsFunction = serverlessConfig
      .split('  PublishNotifications:')[1]
      ?.split('\n  UpdateBalance:')[0];

    expect(publishNotificationsFunction).toContain(
      'functionResponseType: ReportBatchItemFailures',
    );
  });

  beforeEach(() => {
    vi.mocked(AWSAppSyncClient.prototype.mutate).mockClear();
    vi.mocked(logger.error).mockClear();
    (AWSAppSyncClient.prototype.mutate as Mock).mockResolvedValue(
      validNotificationResponse,
    );

    context = ctx();

    context.done();

    callback = vi.fn<Callback>();

    event = {
      Records: [
        {
          dynamodb: {
            NewImage: {
              __typename: {
                S: 'Notification',
              },
              createdAt: {
                S: 'today',
              },
              id: {
                S: 'notification-id',
              },
              message: {
                S: 'Notification message',
              },
              owner: {
                S: 'owner-id',
              },
              payload: {
                S: 'id=1&owner=me',
              },
            },
            SequenceNumber: '1',
          },
          eventName: 'INSERT',
        },
      ],
    };
  });

  it('should throw an error if no region is set', async () => {
    await expect(handler(event, context, callback)).rejects.toThrow(
      'No region set',
    );
  });

  describe('when region is set', () => {
    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.AWS_REGION = 'eu-west-2';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should throw an error if no endpoint is set', async () => {
      await expect(handler(event, context, callback)).rejects.toThrow(
        'No endpoint set',
      );
    });
  });

  describe('when region, endpoint and credentials are set', () => {
    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.AWS_REGION = 'eu-west-2';
      process.env.ENDPOINT = 'https://my.api/graphql';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should call the beacon with the correct params', async () => {
      await handler(event, context, callback);

      expect(AWSAppSyncClient.prototype.mutate).toHaveBeenCalledWith({
        mutation,
        variables: {
          id: 'owner-id',
          input: {
            createdAt: 'today',
            id: 'notification-id',
            message: 'Notification message',
            owner: 'owner-id',
            payload: 'id=1&owner=me',
            read: false,
          },
        },
      });
    });

    it('should publish a notification when its nullable payload is omitted', async () => {
      const image = event.Records[0]?.dynamodb?.NewImage;

      if (!image) throw new Error('Missing notification image');

      delete image.payload;
      (AWSAppSyncClient.prototype.mutate as Mock).mockResolvedValueOnce({
        data: {
          notificationBeacon: {
            ...validNotificationResponse.data.notificationBeacon,
            payload: null,
          },
        },
      });

      await handler(event, context, callback);

      expect(AWSAppSyncClient.prototype.mutate).toHaveBeenCalledWith({
        mutation,
        variables: {
          id: 'owner-id',
          input: {
            createdAt: 'today',
            id: 'notification-id',
            message: 'Notification message',
            owner: 'owner-id',
            payload: undefined,
            read: false,
          },
        },
      });
    });

    it('should publish a notification when its nullable payload is null', async () => {
      const image = event.Records[0]?.dynamodb?.NewImage;

      if (!image) throw new Error('Missing notification image');

      image.payload = {
        NULL: true,
      };
      (AWSAppSyncClient.prototype.mutate as Mock).mockResolvedValueOnce({
        data: {
          notificationBeacon: {
            ...validNotificationResponse.data.notificationBeacon,
            payload: null,
          },
        },
      });

      await handler(event, context, callback);

      expect(AWSAppSyncClient.prototype.mutate).toHaveBeenCalledWith({
        mutation,
        variables: {
          id: 'owner-id',
          input: {
            createdAt: 'today',
            id: 'notification-id',
            message: 'Notification message',
            owner: 'owner-id',
            payload: null,
            read: false,
          },
        },
      });
    });

    it('should skip notifications with a malformed required field', async () => {
      const image = event.Records[0]?.dynamodb?.NewImage;

      if (!image) throw new Error('Missing notification image');

      delete image.message;

      await handler(event, context, callback);

      expect(AWSAppSyncClient.prototype.mutate).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });

    it('should report a failed stream record for retry after a transport error', async () => {
      (AWSAppSyncClient.prototype.mutate as Mock).mockRejectedValueOnce(
        new Error('Something has gone wrong'),
      );

      await expect(handler(event, context, callback)).resolves.toEqual({
        batchItemFailures: [
          {
            itemIdentifier: '1',
          },
        ],
      });

      expect(logger.error).toHaveBeenCalledWith(
        'Failed to publish notification stream record',
        expect.anything(),
      );
    });

    it('should report GraphQL errors from a resolved mutation for retry', async () => {
      (AWSAppSyncClient.prototype.mutate as Mock).mockResolvedValueOnce({
        errors: [{ message: 'Resolver failed' }],
      });

      await expect(handler(event, context, callback)).resolves.toEqual({
        batchItemFailures: [
          {
            itemIdentifier: '1',
          },
        ],
      });

      expect(logger.error).toHaveBeenCalledWith(
        'Failed to publish notification stream record',
        expect.anything(),
      );
    });

    it.each([
      ['missing data', {}],
      ['a null notification', { data: { notificationBeacon: null } }],
      [
        'a malformed notification',
        { data: { notificationBeacon: { id: 'different-notification' } } },
      ],
      [
        'a notification with a mismatched payload',
        {
          data: {
            notificationBeacon: {
              ...validNotificationResponse.data.notificationBeacon,
              payload: 'different-payload',
            },
          },
        },
      ],
    ])('should report a failed stream record for %s', async (_, response) => {
      (AWSAppSyncClient.prototype.mutate as Mock).mockResolvedValueOnce(
        response,
      );

      await expect(handler(event, context, callback)).resolves.toEqual({
        batchItemFailures: [
          {
            itemIdentifier: '1',
          },
        ],
      });

      expect(logger.error).toHaveBeenCalledWith(
        'Failed to publish notification stream record',
        expect.anything(),
      );
    });

    it('should retry a missing mutation result and recover on redelivery', async () => {
      (AWSAppSyncClient.prototype.mutate as Mock)
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce(validNotificationResponse);

      await expect(handler(event, context, callback)).resolves.toEqual({
        batchItemFailures: [
          {
            itemIdentifier: '1',
          },
        ],
      });
      await expect(handler(event, context, callback)).resolves.toEqual({
        batchItemFailures: [],
      });

      expect(AWSAppSyncClient.prototype.mutate).toHaveBeenCalledTimes(2);
    });
  });
});
