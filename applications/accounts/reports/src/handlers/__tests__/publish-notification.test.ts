import type { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { AwsClient } from 'aws4fetch';
import { handler, IEvent } from '../publish-notification';

jest.mock('aws4fetch');

describe('publish-notification', () => {
  const fetch = jest.fn();
  let callback: jest.Mock;
  let context: Context;
  let event: IEvent;
  let env: NodeJS.ProcessEnv;

  beforeEach(() => {
    callback = jest.fn();

    context = ctx();

    context.done();

    event = {
      owner: 'OWNER-ID',
      payload: {
        createdAt: '2021-04-11T19:45:00.000Z',
        downloadUrl: 'https://download.url/report.zip',
        id: 'test-uuid',
        ttl: 1618256700,
      },
    };
  });

  it('should throw an error if no endpoint is set', async () => {
    await expect(handler(event, context, callback)).rejects.toThrow(
      'No endpoint set',
    );
  });

  describe('when an endpoint is set', () => {
    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.ENDPOINT = 'https://api.com';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should throw an error if no stage is set', async () => {
      await expect(handler(event, context, callback)).rejects.toThrow(
        'No stage set',
      );
    });
  });

  describe('when config is set', () => {
    beforeEach(() => {
      env = {
        ...process.env,
      };

      fetch.mockResolvedValue({
        ok: true,
      });

      (AwsClient as jest.Mock).mockImplementation(() => ({
        fetch,
      }));

      process.env.AWS_ACCESS_KEY_ID = 'access-key-id';
      process.env.AWS_REGION = 'eu-west-2';
      process.env.AWS_SECRET_ACCESS_KEY = 'secret-access-key';
      process.env.AWS_SESSION_TOKEN = 'session-token';
      process.env.ENDPOINT = 'https://api.com';
      process.env.STAGE = 'production';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should create a signed fetch client', async () => {
      await handler(event, context, callback);

      expect(AwsClient).toHaveBeenCalledWith({
        accessKeyId: 'access-key-id',
        region: 'eu-west-2',
        secretAccessKey: 'secret-access-key',
        service: 'execute-api',
        sessionToken: 'session-token',
      });
    });

    it('should make the correct request', async () => {
      await handler(event, context, callback);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.com/production/api/v1/notifications',
        {
          body: JSON.stringify({
            message: 'REPORT_READY_TO_DOWNLOAD',
            owner: 'OWNER-ID',
            payload:
              'createdAt=2021-04-11T19%3A45%3A00.000Z&downloadUrl=https%3A%2F%2Fdownload.url%2Freport.zip&id=test-uuid&ttl=1618256700',
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        },
      );
    });

    it('should throw an error if no AWS credentials are set', async () => {
      delete process.env.AWS_ACCESS_KEY_ID;

      await expect(handler(event, context, callback)).rejects.toThrow(
        'No AWS credentials set',
      );
    });

    it('should throw an error if no AWS region is set', async () => {
      delete process.env.AWS_REGION;

      await expect(handler(event, context, callback)).rejects.toThrow(
        'No AWS region set',
      );
    });

    it('should throw an error if notification request fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(handler(event, context, callback)).rejects.toThrow(
        'Notification request failed',
      );
    });

    it('should return complete', async () => {
      await expect(handler(event, context, callback)).resolves.toEqual({
        complete: true,
      });
    });
  });
});
