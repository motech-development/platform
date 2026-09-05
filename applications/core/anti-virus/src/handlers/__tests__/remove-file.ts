import {
  deleteFile,
  deleteStagedFile,
} from '@motech-development/s3-file-operations';
import type { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import type { Mock } from 'vitest';
import { handler, IEvent } from '../remove-file';

vi.mock('@motech-development/s3-file-operations', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('@motech-development/s3-file-operations')
  >()),
  deleteFile: vi.fn(),
  deleteStagedFile: vi.fn(),
}));

describe('remove-file', () => {
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
    };
  });

  it('should call deleteFile with the correct params', async () => {
    await handler(event, context, callback);

    expect(deleteFile).toHaveBeenCalledWith(
      'upload-bucket',
      'path/to/file.pdf',
    );
  });
  it('revokes a rejected attachment without removing another scan’s completed copy', async () => {
    await handler(
      { ...event, managed: true, to: 'downloads' },
      context,
      callback,
    );
    expect(deleteStagedFile).toHaveBeenCalledWith(
      event.from,
      'downloads',
      event.key,
      { pendingOnly: true },
    );
  });
  it('decodes a managed event key exactly once', async () => {
    await handler(
      { ...event, key: 'owner/%252F/file.pdf', managed: true, to: 'downloads' },
      context,
      callback,
    );
    expect(deleteStagedFile).toHaveBeenCalledWith(
      event.from,
      'downloads',
      'owner/%2F/file.pdf',
      { pendingOnly: true },
    );
  });
});
