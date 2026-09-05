import {
  moveFile,
  moveStagedFile,
} from '@motech-development/s3-file-operations';
import type { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import type { Mock } from 'vitest';
import { handler, IEvent } from '../move-file';

vi.mock('@motech-development/s3-file-operations', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('@motech-development/s3-file-operations')
  >()),
  moveFile: vi.fn(),
  moveStagedFile: vi.fn(),
}));

describe('move-file', () => {
  let callback: Mock;
  let context: Context;
  let event: IEvent;

  beforeEach(() => {
    vi.clearAllMocks();
    context = ctx();

    context.done();

    callback = vi.fn();

    event = {
      from: 'upload-bucket',
      key: 'path/to/file.pdf',
      to: 'download-bucket',
    };
  });

  it('should call moveFile with the correct params', async () => {
    await handler(event, context, callback);

    expect(moveFile).toHaveBeenCalledWith(
      'upload-bucket',
      'download-bucket',
      'path/to/file.pdf',
    );
  });
  it('uses the registered transfer for a managed attachment', async () => {
    await handler({ ...event, managed: true }, context, callback);
    expect(moveStagedFile).toHaveBeenCalledWith(
      event.from,
      event.to,
      event.key,
    );
    expect(moveFile).not.toHaveBeenCalled();
  });
  it('decodes a managed event key exactly once', async () => {
    await handler(
      { ...event, key: 'owner/%252F/file.pdf', managed: true, to: 'downloads' },
      context,
      callback,
    );
    expect(moveStagedFile).toHaveBeenCalledWith(
      event.from,
      'downloads',
      'owner/%2F/file.pdf',
    );
  });
});
