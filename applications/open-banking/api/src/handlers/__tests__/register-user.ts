import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import httpClient from '../../shared/http-client';
import { handler, IEvent } from '../register-user';

describe('register-user', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: IEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();

    event = {
      companyId: 'company-id',
      id: 'id',
    };

    httpClient.post = jest.fn().mockResolvedValue({
      data: {
        uuid: 'user-id',
      },
    });
  });

  it('should call the endpoint with the correct params', async () => {
    await handler(event, context, callback);

    expect(httpClient.post).toHaveBeenCalledWith('/users', {
      applicationUserId: 'id:company-id',
    });
  });

  it('should return the response if the user is registered', async () => {
    await expect(handler(event, context, callback)).resolves.toEqual({
      companyId: 'company-id',
      id: 'id',
      user: 'user-id',
    });
  });

  it('should throw if user cannot be registered', async () => {
    (httpClient.post as jest.Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 409,
      },
    });

    await expect(handler(event, context, callback)).rejects.toThrow(
      'Unable to register (409)',
    );
  });
});
