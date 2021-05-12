import { deleteFile } from '@motech-development/s3-file-operations';
import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { handler, IEvent } from '../remove-file';

jest.mock('@motech-development/s3-file-operations', () => ({
  deleteFile: jest.fn(),
}));

describe('remove-file', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: IEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();

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
