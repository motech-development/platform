import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import httpClient from '../../shared/http-client';
import { handler, IEvent } from '../check-user';

describe('check-user', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: IEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();

    event = {
      user: 'user-id',
    };
  });

  it('should return false for register when user is found', async () => {
    httpClient.get = jest.fn().mockResolvedValueOnce({
      data: {
        uuid: 'user-id',
      },
    });

    await expect(handler(event, context, callback)).resolves.toEqual({
      register: false,
      user: 'user-id',
    });
  });

  it('should return true for register when user is found', async () => {
    httpClient.get = jest.fn().mockRejectedValueOnce({});

    await expect(handler(event, context, callback)).resolves.toEqual({
      register: true,
      user: 'user-id',
    });
  });
});
