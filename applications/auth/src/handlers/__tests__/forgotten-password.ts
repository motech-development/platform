import { forgottenPassword } from '@motech-development/schema';
import axios from 'axios';
import { callback, context } from '../../utils';
import { post } from '../forgotten-password';

describe('forgotten password', () => {
  let body: string;

  beforeEach(() => {
    body = JSON.stringify({
      email: 'info@motechdevelopment.co.uk',
    });
  });

  it('it should return a success message when auth0 request is successful', async () => {
    axios.post = jest.fn().mockResolvedValueOnce({
      data: 'All is well',
    });

    await expect(post({ body }, context, callback)).resolves.toEqual({
      body: JSON.stringify({
        message: 'All is well',
      }),
      statusCode: 200,
    });
  });

  it('should throw an error if body is invalid', async () => {
    forgottenPassword.validate = jest.fn().mockRejectedValueOnce({
      message: 'Validation error',
    });

    await expect(post({ body }, context, callback)).resolves.toEqual({
      body: JSON.stringify({
        message: 'Validation error',
      }),
      statusCode: 400,
    });
  });
});
