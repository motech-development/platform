import logIn from '../log-in';

interface IBody {
  password: string;
  username: string;
}

describe('Log in', () => {
  let body: IBody;

  beforeEach(() => {
    body = {
      password: 'SecurePassword123',
      username: 'info@motechdevelopment.co.uk',
    };
  });

  it('should validate with a valid input', async () => {
    await expect(logIn.validate(body)).resolves.toEqual({
      password: 'SecurePassword123',
      username: 'info@motechdevelopment.co.uk',
    });
  });

  it('should throw if username is not present', async () => {
    delete body.username;

    await expect(logIn.validate(body)).rejects.toThrowError(
      'Email address is required',
    );
  });

  it('should throw if password is not present', async () => {
    delete body.password;

    await expect(logIn.validate(body)).rejects.toThrowError(
      'Password is required',
    );
  });
});
