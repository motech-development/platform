import { Context, SQSEvent } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { S3 } from 'aws-sdk';
import { handler } from '../process-delete';

describe('process-delete', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: SQSEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();

    event = {
      Records: [
        {
          messageAttributes: {
            key: {
              stringValue: 'file-1.png',
            },
          },
        },
        {
          messageAttributes: {
            key: {
              stringValue: 'file-2.png',
            },
          },
        },
        {
          messageAttributes: {
            name: {
              stringValue: 'file-2.png',
            },
          },
        },
      ],
    } as unknown as SQSEvent;
  });

  it('should throw error if no download bucket is set', async () => {
    await expect(handler(event, context, callback)).rejects.toThrow(
      'No destination bucket set',
    );
  });

  describe('when a download bucket is set', () => {
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

    it('should delete the correct number files', async () => {
      await handler(event, context, callback);

      expect(S3.prototype.deleteObject).toHaveBeenCalledTimes(2);
    });

    it('should call deleteObject with the correct params', async () => {
      await handler(event, context, callback);

      expect(S3.prototype.deleteObject).toHaveBeenCalledWith({
        Bucket: 'download-bucket',
        Key: 'file-1.png',
      });

      expect(S3.prototype.deleteObject).toHaveBeenCalledWith({
        Bucket: 'download-bucket',
        Key: 'file-2.png',
      });
    });
  });
});
