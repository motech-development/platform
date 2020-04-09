import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { handler } from '../get-params';

describe('get-params', () => {
  let callback: jest.Mock;
  let context: Context;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();
  });

  it('should throw if event is invalid', async () => {
    const event = {};

    await expect(handler(event, context, callback)).rejects.toThrow();
  });

  it('should strip out any spurious properties in the event', async () => {
    const event = {
      bank: 'my-bank',
      callback: 'https://my.callback',
      companyId: 'company-id',
      id: 'id',
      token: 'my-token',
      url: 'https://my.url',
      zebra: 'What?!',
    };

    await expect(handler(event, context, callback)).resolves.toEqual({
      bank: 'my-bank',
      callback: 'https://my.callback',
      check: false,
      companyId: 'company-id',
      id: 'id',
      token: 'my-token',
      url: 'https://my.url',
    });
  });

  it('should check if user is set', async () => {
    const event = {
      bank: 'my-bank',
      callback: 'https://my.callback',
      companyId: 'company-id',
      id: 'id',
      token: 'my-token',
      url: 'https://my.url',
      user: 'user-id',
    };

    await expect(handler(event, context, callback)).resolves.toEqual({
      bank: 'my-bank',
      callback: 'https://my.callback',
      check: true,
      companyId: 'company-id',
      id: 'id',
      token: 'my-token',
      url: 'https://my.url',
      user: 'user-id',
    });
  });

  it('should not check if user is not set', async () => {
    const event = {
      bank: 'my-bank',
      callback: 'https://my.callback',
      companyId: 'company-id',
      id: 'id',
      token: 'my-token',
      url: 'https://my.url',
    };

    await expect(handler(event, context, callback)).resolves.toEqual({
      bank: 'my-bank',
      callback: 'https://my.callback',
      check: false,
      companyId: 'company-id',
      id: 'id',
      token: 'my-token',
      url: 'https://my.url',
    });
  });
});
