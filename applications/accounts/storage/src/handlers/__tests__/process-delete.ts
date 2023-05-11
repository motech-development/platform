import { deleteFile } from '@motech-development/s3-file-operations';
import { Context, SQSEvent } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { handler } from '../process-delete';

jest.mock('@motech-development/s3-file-operations');

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

      expect(deleteFile).toHaveBeenCalledTimes(2);
    });

    it('should call deleteObject with the correct params', async () => {
      await handler(event, context, callback);

      expect(deleteFile).toHaveBeenCalledWith('download-bucket', 'file-1.png');

      expect(deleteFile).toHaveBeenCalledWith('download-bucket', 'file-2.png');
    });
  });
});
