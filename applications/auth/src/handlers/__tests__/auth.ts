import { logIn } from '@motech-development/schema';
import axios from 'axios';
import { callback, context } from '../../utils';
import { post } from '../auth';

describe('auth', () => {
  it('should throw if Auth0 returns an error', async () => {
    axios.post = jest.fn().mockRejectedValueOnce({
      response: {
        data: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          error_description: 'This is an error',
        },
        status: 403,
      },
    });

    const body = JSON.stringify({
      password: 'SecurePassword123',
      username: 'info@motechdevelopment.co.uk',
    });

    await expect(post({ body }, context, callback)).resolves.toEqual({
      body: JSON.stringify({
        message: 'This is an error',
      }),
      statusCode: 403,
    });
  });

  it('should return a successful response Auth0 request is successful', async () => {
    axios.post = jest.fn().mockResolvedValueOnce({
      data: {
        scope: 'openid',
      },
    });

    const body = JSON.stringify({
      password: 'SecurePassword123',
      username: 'info@motechdevelopment.co.uk',
    });

    await expect(post({ body }, context, callback)).resolves.toEqual({
      body: JSON.stringify({
        scope: 'openid',
      }),
      statusCode: 200,
    });
  });

  it('should throw an error if body is invalid', async () => {
    logIn.validate = jest.fn().mockRejectedValueOnce({
      message: 'Validation error',
    });

    const body = JSON.stringify({
      password: 'SecurePassword123',
      username: 'info@motechdevelopment.co.uk',
    });

    await expect(post({ body }, context, callback)).resolves.toEqual({
      body: JSON.stringify({
        message: 'Validation error',
      }),
      statusCode: 400,
    });
  });
});
