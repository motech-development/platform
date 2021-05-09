import { AWSAppSyncClient } from 'aws-appsync';
import { Context, DynamoDBStreamEvent } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { config } from 'aws-sdk';
import { handler, mutation } from '../publish-notifications';

interface ICredentials {
  accessKeyId: string;
  secretAccessKey: string;
}

describe('publish-notifications', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: DynamoDBStreamEvent;
  let env: NodeJS.ProcessEnv;
  let credentials: ICredentials;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();

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

  describe('when region and endpoint is set', () => {
    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.AWS_REGION = 'eu-west-2';
      process.env.ENDPOINT = 'https://my.api/graphql';

      credentials = {
        ...(config.credentials as ICredentials),
      };
    });

    afterEach(() => {
      process.env = env;
      config.credentials = credentials;
    });

    it('should throw an error if no credentials are is set', async () => {
      delete config.credentials;

      await expect(handler(event, context, callback)).rejects.toThrow(
        'No AWS credentials set',
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

      jest.spyOn(console, 'error').mockReturnValue();
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

    it('should swallow the error', async () => {
      (AWSAppSyncClient.prototype.mutate as jest.Mock).mockRejectedValueOnce(
        new Error('Something has gone wrong'),
      );

      await handler(event, context, callback);

      // eslint-disable-next-line no-console
      expect(console.error).toHaveBeenCalledWith('Something has gone wrong');
    });
  });
});
