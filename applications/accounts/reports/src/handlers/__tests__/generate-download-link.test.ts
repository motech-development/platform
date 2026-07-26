import { createSignedUrl } from '@motech-development/s3-file-operations';
import type { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import type { Mock } from 'vitest';
import { handler, IEvent } from '../generate-download-link';

vi.mock('@motech-development/s3-file-operations');

describe('generate-download-link', () => {
  let callback: Mock;
  let context: Context;
  let event: IEvent;

  beforeEach(() => {
    callback = vi.fn();

    context = ctx();

    context.done();

    event = {
      companyId: 'COMPANY-ID',
      key: 'PATH/TO/REPORT.zip',
      owner: 'OWNER-ID',
    };
  });

  it('should throw an error if no bucket set', async () => {
    await expect(handler(event, context, callback)).rejects.toThrow(
      'No bucket set',
    );
  });

  describe('when a bucket is set', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.BUCKET = 'BUCKET';

      (createSignedUrl as Mock).mockResolvedValue(
        'https://download.url/report.zip',
      );
    });

    afterEach(() => {
      process.env = env;
    });

    it('should generate a download link with the correct params', async () => {
      await handler(event, context, callback);

      expect(createSignedUrl).toHaveBeenCalledWith(
        'getObject',
        'BUCKET',
        'PATH/TO/REPORT.zip',
        86400,
      );
    });

    it('should return the correct data', async () => {
      await expect(handler(event, context, callback)).resolves.toEqual({
        companyId: 'COMPANY-ID',
        downloadUrl: 'https://download.url/report.zip',
        key: 'PATH/TO/REPORT.zip',
        owner: 'OWNER-ID',
      });
    });
  });
});
