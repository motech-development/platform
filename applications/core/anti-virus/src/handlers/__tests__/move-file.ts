import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { moveFile } from '../../shared/file-operations';
import { handler, IEvent } from '../move-file';

jest.mock('../../shared/file-operations', () => ({
  moveFile: jest.fn(),
}));

describe('move-file', () => {
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
