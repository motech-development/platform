import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import queueCompanyDelete from '../handlers/queue-company-delete';
import { handler, IEvent } from '../lambda';

jest.mock('../handlers/queue-company-delete', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('lambda', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: IEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();

    event = {
      arguments: {
        id: 'id',
        owner: 'owner',
      },
      field: 'unknown',
    };
  });

  it('should throw if field is unrecognised', async () => {
    await expect(handler(event, context, callback)).rejects.toThrow(
      'Unrecognised field',
    );
  });

  it('should call queueCompanyDelete with the correct params', async () => {
    event.field = 'queueCompanyDelete';

    await handler(event, context, callback);

    expect(queueCompanyDelete).toHaveBeenCalledWith({
      id: 'id',
      owner: 'owner',
    });
  });
});
