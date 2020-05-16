import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { deleteFile } from '../../shared/file-operations';
import { handler, IEvent } from '../remove-file';

jest.mock('../../shared/file-operations', () => ({
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
