import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { handler, IEvent } from '../get-callback';
import httpClient from '../../shared/http-client';

describe('get-callback', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: IEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();

    event = {
      bank: 'test-bank',
      callback: 'https://my.callback',
      user: 'user-id',
    };

    httpClient.post = jest.fn().mockResolvedValue({
      data: {
        data: {
          authorisationUrl: 'https://bank.login',
        },
      },
    });
  });

  it('should call the correct endpoint', async () => {
    await handler(event, context, callback);

    expect(httpClient.post).toHaveBeenCalledWith('/account-auth-requests', {
      callback: 'https://my.callback',
      institutionId: 'test-bank',
      userUuid: 'user-id',
    });
  });

  it('should return success response', async () => {
    await expect(handler(event, context, callback)).resolves.toEqual({
      authorisationUrl: 'https://bank.login',
      bank: 'test-bank',
      callback: 'https://my.callback',
      user: 'user-id',
    });
  });

  it('should throw if unable to get callback', async () => {
    (httpClient.post as jest.Mock).mockRejectedValueOnce({
      response: {
        status: 403,
      },
    });

    await expect(handler(event, context, callback)).rejects.toThrow(
      'Unable to authenticate (403)',
    );
  });
});
