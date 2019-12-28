import forgottenPassword from '../forgotten-password';

interface IBody {
  email: string;
}

describe('Forgotten password', () => {
  let body: IBody;

  beforeEach(() => {
    body = {
      email: 'info@motechdevelopment.co.uk',
    };
  });

  it('should validate with a valid input', async () => {
    await expect(forgottenPassword.validate(body)).resolves.toEqual({
      email: 'info@motechdevelopment.co.uk',
    });
  });

  it('should throw if email is invalid', async () => {
    body.email = 'info[at]motechdevelopment.co.uk';

    await expect(forgottenPassword.validate(body)).rejects.toThrowError(
      'Please enter a valid email address',
    );
  });

  it('should throw if email is not present', async () => {
    delete body.email;

    await expect(forgottenPassword.validate(body)).rejects.toThrowError(
      'Email address is required',
    );
  });
});
