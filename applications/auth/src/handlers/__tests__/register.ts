import axios from 'axios';
import { callback, context } from '../../utils';
import { post } from '../register';

describe('register', () => {
  it('should throw if body is incorrect', async () => {
    const body = JSON.stringify({
      incorrect: true,
    });

    await expect(post({ body }, context, callback)).resolves.toEqual({
      body: JSON.stringify({
        message: 'Password is required',
      }),
      statusCode: 400,
    });
  });

  it('should throw if Auth0 returns an error', async () => {
    axios.post = jest.fn().mockRejectedValueOnce({
      response: {
        data: {
          description: 'This is an error',
          statusCode: 422,
        },
      },
    });

    const body = JSON.stringify({
      email: 'test@example.com',
      name: 'Mo',
      password: 'Wrong password',
    });

    await expect(post({ body }, context, callback)).resolves.toEqual({
      body: JSON.stringify({
        message: 'This is an error',
      }),
      statusCode: 422,
    });
  });

  it('should return a successful response when the user is registered', async () => {
    axios.post = jest.fn().mockResolvedValueOnce({
      data: {
        email: 'test@example.com',
        name: 'Mo',
      },
    });

    const body = JSON.stringify({
      email: 'test@example.com',
      name: 'Mo',
      password: 'SecurePassword',
    });

    await expect(post({ body }, context, callback)).resolves.toEqual({
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Mo',
      }),
      statusCode: 201,
    });
  });
});
