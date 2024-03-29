import { createSignedUrl } from '@motech-development/s3-file-operations';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { handler } from '../signed-upload';

jest.mock('@motech-development/s3-file-operations', () => ({
  createSignedUrl: jest.fn().mockResolvedValue('https://signed-url'),
}));

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('test-uuid'),
}));

describe('signed-upload', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: APIGatewayProxyEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();

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
    await handler(event, context, callback);

    expect(callback).toHaveBeenCalledWith(null, {
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
    });

    afterEach(() => {
      process.env = env;
    });

    it('should return an error response if no body is set', async () => {
      event.body = null;

      await handler(event, context, callback);

      expect(callback).toHaveBeenCalledWith(null, {
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

      await handler(event, context, callback);

      expect(callback).toHaveBeenCalledWith(null, {
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

      await handler(event, context, callback);

      expect(callback).toHaveBeenCalledWith(null, {
        body: JSON.stringify({
          id: 'test-uuid',
          url: 'https://signed-url',
        }),
        statusCode: 200,
      });
    });

    it('should return a success response', async () => {
      await handler(event, context, callback);

      expect(callback).toHaveBeenCalledWith(null, {
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
            id: 'transaction-id',
            typename: 'Test',
          },
        },
      );
    });
  });
});
