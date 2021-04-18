import { createSignedUrl } from '@motech-development/s3-file-operations';
import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { handler, IEvent } from '../generate-download-link';

describe('generate-download-link', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: IEvent;

  beforeEach(() => {
    callback = jest.fn();

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

      (createSignedUrl as jest.Mock).mockResolvedValue(
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
