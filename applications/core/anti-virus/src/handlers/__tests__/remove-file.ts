import { deleteFile } from '@motech-development/s3-file-operations';
import type { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import type { Mock } from 'vitest';
import { handler, IEvent } from '../remove-file';

vi.mock('@motech-development/s3-file-operations', () => ({
  deleteFile: vi.fn(),
}));

describe('remove-file', () => {
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
    };
  });

  it('should call deleteFile with the correct params', async () => {
    await handler(event, context, callback);

    expect(deleteFile).toHaveBeenCalledWith(
      'upload-bucket',
      'path/to/file.pdf',
    );
  });
});
