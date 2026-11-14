import {
  allocateStagedFile,
  createSignedUrl,
} from '@motech-development/s3-file-operations';
import { captureException } from '@sentry/aws-serverless';
import type { APIGatewayProxyEvent, Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import type { Mock } from 'vitest';
import { handler } from '../signed-upload';

vi.mock('@motech-development/s3-file-operations', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('@motech-development/s3-file-operations')
  >()),
  allocateStagedFile: vi.fn(),
  createSignedUrl: vi.fn().mockResolvedValue('https://signed-url'),
}));

vi.mock('uuid', () => ({
  v4: vi.fn().mockReturnValue('test-uuid'),
}));

vi.mock('@sentry/aws-serverless', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@sentry/aws-serverless')>()),
  captureException: vi.fn(),
}));

describe('signed-upload', () => {
  let callback: Mock;
  let context: Context;
  let event: APIGatewayProxyEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = vi.fn();

    event = {
      body: JSON.stringify({
        companyId: 'company-id',
        contentType: 'image/png',
        extension: 'png',
        metadata: {
          id: null,
          typename: 'Test',
        },
        owner: 'owner',
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

      process.env.UPLOAD_BUCKET = 'upload-bucket';
      process.env.DOWNLOAD_BUCKET = 'download-bucket';
      process.env.QUARANTINE_RETENTION_DAYS = '1';
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
        companyId: 'company-id',
        extension: 'exe',
        metadata: {
          id: null,
          typename: 'Test',
        },
        owner: 'owner',
      });

      await expect(handler(event, context, callback)).resolves.toEqual({
        body: JSON.stringify({
          message: 'Invalid request',
          statusCode: 400,
        }),
        statusCode: 400,
      });
    });

    it('should update a file regardless of extension case', async () => {
      event.body = JSON.stringify({
        companyId: 'company-id',
        contentType: 'image/png',
        extension: 'PDF',
        metadata: {
          id: 'transaction-id',
          typename: 'Test',
        },
        owner: 'owner',
      });

      await expect(handler(event, context, callback)).resolves.toEqual({
        body: JSON.stringify({
          id: 'test-uuid',
          url: 'https://signed-url',
        }),
        statusCode: 200,
      });
    });

    it('allocates ownership before issuing the upload URL', async () => {
      await handler(event, context, callback);

      expect(allocateStagedFile).toHaveBeenLastCalledWith(
        'upload-bucket',
        'download-bucket',
        'owner/company-id/test-uuid.png',
        30,
        1,
      );
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

    it('does not issue an upload URL if allocation fails', async () => {
      const error = new Error('Database unavailable');

      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(allocateStagedFile).mockRejectedValueOnce(error);
      vi.mocked(createSignedUrl).mockClear();

      const result = await handler(event, context, callback);

      expect(result).toMatchObject({ statusCode: 500 });
      expect(captureException).toHaveBeenCalledWith(error);
      expect(createSignedUrl).not.toHaveBeenCalled();
    });

    it('should return a success response', async () => {
      await expect(handler(event, context, callback)).resolves.toEqual({
        body: JSON.stringify({
          id: 'test-uuid',
          url: 'https://signed-url',
        }),
        statusCode: 200,
      });
    });

    it('should create a signed URL with the correct params when an ID is not sent', async () => {
      await handler(event, context, callback);

      expect(createSignedUrl).toHaveBeenLastCalledWith(
        'putObject',
        'upload-bucket',
        'owner/company-id/test-uuid.png',
        30,
        {
          ContentType: 'image/png',
          Metadata: {
            'attachment-lifecycle': 'v1',
            typename: 'Test',
          },
        },
      );
    });

    it('should create a signed URL with the correct params when an ID is sent', async () => {
      event.body = JSON.stringify({
        companyId: 'company-id',
        contentType: 'image/png',
        extension: 'png',
        metadata: {
          id: 'transaction-id',
          typename: 'Test',
        },
        owner: 'owner',
      });

      await handler(event, context, callback);

      expect(createSignedUrl).toHaveBeenLastCalledWith(
        'putObject',
        'upload-bucket',
        'owner/company-id/test-uuid.png',
        30,
        {
          ContentType: 'image/png',
          Metadata: {
            'attachment-lifecycle': 'v1',
            id: 'transaction-id',
            typename: 'Test',
          },
        },
      );
    });
  });
});
