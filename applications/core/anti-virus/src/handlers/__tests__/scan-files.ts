import {
  createDirectory,
  downloadFile,
} from '@motech-development/s3-file-operations';
import type { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import type { Mock } from 'vitest';
import { scanFile } from '../../shared/clam-av';
import { handler, IEvent } from '../scan-file';

vi.mock('../../shared/clam-av', () => ({
  scanFile: vi.fn().mockResolvedValue(true),
}));

vi.mock('@motech-development/s3-file-operations', () => ({
  createDirectory: vi.fn(),
  downloadFile: vi.fn(),
}));

describe('scan-files', () => {
  let callback: Mock;
  let context: Context;
  let event: IEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = vi.fn();

    event = {
      from: 'upload-bucket',
      key: 'path/to/file.pdf',
      to: 'download-bucket',
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should throw an error if bucket is not set', async () => {
    await expect(handler(event, context, callback)).rejects.toThrow(
      'No bucket set',
    );
  });

  describe('when bucket is set', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.BUCKET = 'definitions-bucket';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should create the temporary download folder', async () => {
      await handler(event, context, callback);

      expect(createDirectory).toHaveBeenCalledWith('/tmp/downloads');
    });

    it('should download the file to be scanned', async () => {
      await handler(event, context, callback);

      expect(downloadFile).toHaveBeenCalledWith(
        'upload-bucket',
        'path/to/file.pdf',
        '/tmp/downloads',
      );
    });

    it('should download the virus definitions if the temporary download folder exists', async () => {
      await handler(event, context, callback);

      expect(downloadFile).toHaveBeenCalledWith(
        'definitions-bucket',
        'bytecode.cvd',
        '/tmp',
      );
      expect(downloadFile).toHaveBeenCalledWith(
        'definitions-bucket',
        'daily.cvd',
        '/tmp',
      );
      expect(downloadFile).toHaveBeenCalledWith(
        'definitions-bucket',
        'main.cvd',
        '/tmp',
      );
    });

    it('should not download the virus definitions if the temporary download folder exists', async () => {
      (createDirectory as Mock).mockResolvedValueOnce(true);

      await handler(event, context, callback);

      expect(downloadFile).not.toHaveBeenCalledWith(
        'definitions-bucket',
        'bytecode.cvd',
        '/tmp',
      );
      expect(downloadFile).not.toHaveBeenCalledWith(
        'definitions-bucket',
        'daily.cvd',
        '/tmp',
      );
      expect(downloadFile).not.toHaveBeenCalledWith(
        'definitions-bucket',
        'main.cvd',
        '/tmp',
      );
    });

    it('should scan the correct file', async () => {
      (downloadFile as Mock).mockResolvedValueOnce('/tmp/downloads/file.pdf');

      await handler(event, context, callback);

      expect(scanFile).toHaveBeenCalledWith('/tmp/downloads/file.pdf', '/tmp');
    });

    it('should return the result from the scan', async () => {
      await expect(handler(event, context, callback)).resolves.toEqual({
        from: 'upload-bucket',
        key: 'path/to/file.pdf',
        result: true,
        to: 'download-bucket',
      });
    });
  });
});
