import { createSignedUrl } from '@motech-development/s3-file-operations';
import { captureException } from '@sentry/aws-serverless';
import type { APIGatewayProxyEvent, Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import type { Mock } from 'vitest';
import { handler } from '../signed-download';

vi.mock('@motech-development/s3-file-operations', () => ({
  createSignedUrl: vi.fn().mockResolvedValue('https://signed-url'),
}));

vi.mock('@sentry/aws-serverless', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@sentry/aws-serverless')>()),
  captureException: vi.fn(),
}));

describe('signed-download', () => {
  let callback: Mock;
  let context: Context;
  let event: APIGatewayProxyEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = vi.fn();

    event = {
      body: JSON.stringify({
        owner: 'owner',
        path: 'path/to/download.png',
      }),
    } as APIGatewayProxyEvent;
  });

  it('should error response if no bucket is set', async () => {
    await expect(handler(event, context, callback)).resolves.toEqual({
      body: JSON.stringify({
        message: 'No bucket set',
        statusCode: 400,
      }),
      statusCode: 400,
    });
  });

  describe('when bucket is set', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.DOWNLOAD_BUCKET = 'download-bucket';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should return an error response if no body is set', async () => {
      event.body = null;

      await expect(handler(event, context, callback)).resolves.toEqual({
        body: JSON.stringify({
          message: 'No body found',
          statusCode: 400,
        }),
        statusCode: 400,
      });
    });

    it('should return an error response if body is invalid', async () => {
      event.body = JSON.stringify({
        path: 'path/to/download.png',
      });

      await expect(handler(event, context, callback)).resolves.toEqual({
        body: JSON.stringify({
          message: 'Invalid request',
          statusCode: 400,
        }),
        statusCode: 400,
      });
    });

    it('should return an error response if body is not valid JSON', async () => {
      event.body = '{';

      await expect(handler(event, context, callback)).resolves.toEqual({
        body: JSON.stringify({
          message: 'Invalid request',
          statusCode: 400,
        }),
        statusCode: 400,
      });
    });

    it.each([
      '../other-owner/file.png',
      'path/../../other-owner/file.png',
      '.',
    ])(
      'should return an error response if path %s resolves outside the owner',
      async (path) => {
        event.body = JSON.stringify({
          owner: 'owner',
          path,
        });

        await expect(handler(event, context, callback)).resolves.toEqual({
          body: JSON.stringify({
            message: 'Invalid request',
            statusCode: 400,
          }),
          statusCode: 400,
        });
        expect(createSignedUrl).not.toHaveBeenCalled();
      },
    );

    it('should allow a path that resolves inside the owner', async () => {
      event.body = JSON.stringify({
        owner: 'owner',
        path: 'path/../to/download.png',
      });

      await handler(event, context, callback);

      expect(createSignedUrl).toHaveBeenLastCalledWith(
        'getObject',
        'download-bucket',
        'owner/to/download.png',
        30,
      );
    });

    it('should report a 500 response if signing fails', async () => {
      const error = new Error('Signing failed');

      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(createSignedUrl).mockRejectedValueOnce(error);

      await expect(handler(event, context, callback)).resolves.toMatchObject({
        statusCode: 500,
      });
      expect(captureException).toHaveBeenCalledWith(error);
    });

    it('should return a success response', async () => {
      await expect(handler(event, context, callback)).resolves.toEqual({
        body: JSON.stringify({
          url: 'https://signed-url',
        }),
        statusCode: 200,
      });
    });

    it('should create a signed URL with the correct params', async () => {
      await handler(event, context, callback);

      expect(createSignedUrl).toHaveBeenLastCalledWith(
        'getObject',
        'download-bucket',
        'owner/path/to/download.png',
        30,
      );
    });
  });
});
