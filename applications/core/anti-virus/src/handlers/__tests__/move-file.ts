import { moveFile } from '@motech-development/s3-file-operations';
import type { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import type { Mock } from 'vitest';
import { handler, IEvent } from '../move-file';

vi.mock('@motech-development/s3-file-operations', () => ({
  moveFile: vi.fn(),
}));

describe('move-file', () => {
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

  it('should call moveFile with the correct params', async () => {
    await handler(event, context, callback);

    expect(moveFile).toHaveBeenCalledWith(
      'upload-bucket',
      'download-bucket',
      'path/to/file.pdf',
    );
  });
});
