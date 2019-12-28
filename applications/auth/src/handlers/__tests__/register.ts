/* eslint-disable @typescript-eslint/camelcase */
import { register } from '@motech-development/schema';
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

  it('should throw an error if body is invalid', async () => {
    register.validate = jest.fn().mockRejectedValueOnce({
      message: 'Validation error',
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
        message: 'Validation error',
      }),
      statusCode: 400,
    });
  });
});
