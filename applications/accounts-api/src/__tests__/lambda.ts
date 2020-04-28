import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { handler } from '../lambda';
import getBalance from '../handlers/get-balance';

jest.mock('../handlers/get-balance', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('lambda', () => {
  let callback: jest.Mock;
  let context: Context;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();
  });

  it('should throw an error if field is unknown', async () => {
    const event = {
      args: {
        id: 'id',
        owner: 'owner',
      },
      field: 'unknown',
    };

    await expect(handler(event, context, callback)).rejects.toThrow(
      'Unrecognised field',
    );
  });

  it('should call the correct handler if the field is getBalance', async () => {
    const event = {
      args: {
        id: 'id',
        owner: 'owner',
      },
      field: 'getBalance',
    };

    await handler(event, context, callback);

    expect(getBalance).toHaveBeenCalledWith({
      id: 'id',
      owner: 'owner',
    });
  });
});
