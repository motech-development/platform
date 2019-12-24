/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios';
import { callback, context } from '../../utils';
import { post } from '../register';

describe('register', () => {
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
      confirmPassword: 'SecurePassword123',
      email: 'info@motechdevelopment.co.uk',
      family_name: 'Gusbi',
      given_name: 'Mo',
      password: 'SecurePassword123',
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
      confirmPassword: 'SecurePassword123',
      email: 'info@motechdevelopment.co.uk',
      family_name: 'Gusbi',
      given_name: 'Mo',
      password: 'SecurePassword123',
    });

    await expect(post({ body }, context, callback)).resolves.toEqual({
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Mo',
      }),
      statusCode: 201,
    });
  });

  describe('validation', () => {
    it('should throw if passwords to not match', async () => {
      const body = JSON.stringify({
        confirmPassword: 'Hello',
        email: 'info@motechdevelopment.co.uk',
        family_name: 'Gusbi',
        given_name: 'Mo',
        password: 'SecurePassword123',
      });

      await expect(post({ body }, context, callback)).resolves.toEqual({
        body: JSON.stringify({
          message: 'Passwords to not match',
        }),
        statusCode: 400,
      });
    });

    it('should throw if password confirmation is not present', async () => {
      const body = JSON.stringify({
        email: 'info@motechdevelopment.co.uk',
        family_name: 'Gusbi',
        given_name: 'Mo',
        password: 'SecurePassword123',
      });

      await expect(post({ body }, context, callback)).resolves.toEqual({
        body: JSON.stringify({
          message: 'Please confirm your password',
        }),
        statusCode: 400,
      });
    });

    it('should throw if email is invalid', async () => {
      const body = JSON.stringify({
        confirmPassword: 'SecurePassword123',
        email: 'info[at]motechdevelopment.co.uk',
        family_name: 'Gusbi',
        given_name: 'Mo',
        password: 'SecurePassword123',
      });

      await expect(post({ body }, context, callback)).resolves.toEqual({
        body: JSON.stringify({
          message: 'Please enter a valid email address',
        }),
        statusCode: 400,
      });
    });

    it('should throw if email is not present', async () => {
      const body = JSON.stringify({
        confirmPassword: 'SecurePassword123',
        family_name: 'Gusbi',
        given_name: 'Mo',
        password: 'SecurePassword123',
      });

      await expect(post({ body }, context, callback)).resolves.toEqual({
        body: JSON.stringify({
          message: 'Email address is required',
        }),
        statusCode: 400,
      });
    });

    it('should throw if family name is not present', async () => {
      const body = JSON.stringify({
        confirmPassword: 'SecurePassword123',
        email: 'info@motechdevelopment.co.uk',
        given_name: 'Mo',
        password: 'SecurePassword123',
      });

      await expect(post({ body }, context, callback)).resolves.toEqual({
        body: JSON.stringify({
          message: 'Your surname is required',
        }),
        statusCode: 400,
      });
    });

    it('should throw if given name is not present', async () => {
      const body = JSON.stringify({
        confirmPassword: 'SecurePassword123',
        email: 'info@motechdevelopment.co.uk',
        family_name: 'Gusbi',
        password: 'SecurePassword123',
      });

      await expect(post({ body }, context, callback)).resolves.toEqual({
        body: JSON.stringify({
          message: 'Your forename is required',
        }),
        statusCode: 400,
      });
    });

    it('should throw if password is not present', async () => {
      const body = JSON.stringify({
        confirmPassword: undefined,
        email: 'info@motechdevelopment.co.uk',
        family_name: 'Gusbi',
        given_name: 'Mo',
        password: undefined,
      });

      await expect(post({ body }, context, callback)).resolves.toEqual({
        body: JSON.stringify({
          message: 'Password is required',
        }),
        statusCode: 400,
      });
    });

    it('should throw if password is less than 8 characters long', async () => {
      const body = JSON.stringify({
        confirmPassword: 'Passwor',
        email: 'info@motechdevelopment.co.uk',
        family_name: 'Gusbi',
        given_name: 'Mo',
        password: 'Passwor',
      });

      await expect(post({ body }, context, callback)).resolves.toEqual({
        body: JSON.stringify({
          message: 'Password must be at least 8 characters long',
        }),
        statusCode: 400,
      });
    });

    it('should throw if password is does not contain a uppercase letter', async () => {
      const body = JSON.stringify({
        confirmPassword: 'password',
        email: 'info@motechdevelopment.co.uk',
        family_name: 'Gusbi',
        given_name: 'Mo',
        password: 'password',
      });

      await expect(post({ body }, context, callback)).resolves.toEqual({
        body: JSON.stringify({
          message: 'Password must contain at least one uppercase character',
        }),
        statusCode: 400,
      });
    });

    it('should throw if password is does not contain a lowercase letter', async () => {
      const body = JSON.stringify({
        confirmPassword: 'PASSWORD',
        email: 'info@motechdevelopment.co.uk',
        family_name: 'Gusbi',
        given_name: 'Mo',
        password: 'PASSWORD',
      });

      await expect(post({ body }, context, callback)).resolves.toEqual({
        body: JSON.stringify({
          message: 'Password must contain at least one lowercase character',
        }),
        statusCode: 400,
      });
    });

    it('should throw if password is does not contain a number or special character', async () => {
      const body = JSON.stringify({
        confirmPassword: 'SecurePassword',
        email: 'info@motechdevelopment.co.uk',
        family_name: 'Gusbi',
        given_name: 'Mo',
        password: 'SecurePassword',
      });

      await expect(post({ body }, context, callback)).resolves.toEqual({
        body: JSON.stringify({
          message:
            'Password must contain at least 1 number or special character (!@#$%^&*)',
        }),
        statusCode: 400,
      });
    });
  });
});
