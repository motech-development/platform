import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { S3 } from 'aws-sdk';
import { handler } from '../signed-upload';

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
        extension: 'png',
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
      delete event.body;

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

    it('should create a signed URL with the correct params', async () => {
      await handler(event, context, callback);

      expect(S3.prototype.getSignedUrlPromise).toHaveBeenLastCalledWith(
        'putObject',
        {
          Bucket: 'upload-bucket',
          ContentType: 'multipart/form-data',
          Expires: 30,
          Key: 'owner/company-id/test-uuid.png',
        },
      );
    });
  });
});
