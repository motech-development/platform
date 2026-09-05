import { deleteStagedFile } from '@motech-development/s3-file-operations';
import type { Context, SQSEvent } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import type { Mock } from 'vitest';
import { handler } from '../process-delete';

vi.mock('@motech-development/s3-file-operations');

describe('process-delete', () => {
  let callback: Mock;
  let context: Context;
  let event: SQSEvent;

  beforeEach(() => {
    vi.clearAllMocks();
    context = ctx();

    context.done();

    callback = vi.fn();

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
      process.env.UPLOAD_BUCKET = 'upload-bucket';
    });

    afterEach(() => {
      process.env = env;
    });

    it('leaves failed cleanup available for queue retry', async () => {
      vi.mocked(deleteStagedFile).mockRejectedValueOnce(
        new Error('Cancellation failed'),
      );
      await expect(handler(event, context, callback)).rejects.toThrow(
        'Cancellation failed',
      );
    });

    it('should delete the correct number files', async () => {
      await handler(event, context, callback);

      expect(deleteStagedFile).toHaveBeenCalledTimes(2);
    });

    it('should call deleteObject with the correct params', async () => {
      await handler(event, context, callback);

      expect(deleteStagedFile).toHaveBeenCalledWith(
        'upload-bucket',
        'download-bucket',
        'file-1.png',
      );

      expect(deleteStagedFile).toHaveBeenCalledWith(
        'upload-bucket',
        'download-bucket',
        'file-2.png',
      );
    });
  });
});
