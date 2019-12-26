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

  it('should return a successful response auth is successful', async () => {
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

  describe('auth', () => {
    it('should throw if username is not present', async () => {
      const body = JSON.stringify({
        password: 'SecurePassword123',
      });

      await expect(post({ body }, context, callback)).resolves.toEqual({
        body: JSON.stringify({
          message: 'Email address is required',
        }),
        statusCode: 400,
      });
    });

    it('should throw if password is not present', async () => {
      const body = JSON.stringify({
        username: 'info@motechdevelopment.co.uk',
      });

      await expect(post({ body }, context, callback)).resolves.toEqual({
        body: JSON.stringify({
          message: 'Password is required',
        }),
        statusCode: 400,
      });
    });
  });
});
