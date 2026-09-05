import {
  allocateStagedFile,
  createSignedUrl,
} from '@motech-development/s3-file-operations';
import type { APIGatewayProxyEvent, Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
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

describe('signed-upload', () => {
  let context: Context;
  let event: APIGatewayProxyEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

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
    await expect(handler(event, context)).resolves.toEqual({
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

      await expect(handler(event, context)).resolves.toEqual({
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

      await expect(handler(event, context)).resolves.toEqual({
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

      await expect(handler(event, context)).resolves.toEqual({
        body: JSON.stringify({
          id: 'test-uuid',
          url: 'https://signed-url',
        }),
        statusCode: 200,
      });
    });

    it('allocates ownership before issuing the upload URL', async () => {
      await handler(event, context);
      expect(allocateStagedFile).toHaveBeenLastCalledWith(
        'upload-bucket',
        'download-bucket',
        'owner/company-id/test-uuid.png',
        30,
        1,
      );
    });

    it('does not issue an upload URL if allocation fails', async () => {
      vi.mocked(allocateStagedFile).mockRejectedValueOnce(
        new Error('Database unavailable'),
      );
      vi.mocked(createSignedUrl).mockClear();
      const result = await handler(event, context);
      expect(result.statusCode).toBe(400);
      expect(createSignedUrl).not.toHaveBeenCalled();
    });

    it('should return a success response', async () => {
      await expect(handler(event, context)).resolves.toEqual({
        body: JSON.stringify({
          id: 'test-uuid',
          url: 'https://signed-url',
        }),
        statusCode: 200,
      });
    });

    it('should create a signed URL with the correct params when an ID is not sent', async () => {
      await handler(event, context);

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

      await handler(event, context);

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
