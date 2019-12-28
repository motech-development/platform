/* eslint-disable @typescript-eslint/camelcase */
import register from '../register';

interface IBody {
  confirmPassword: string | undefined;
  email: string;
  family_name: string;
  given_name: string;
  password: string | undefined;
}

describe('Register', () => {
  let body: IBody;

  beforeEach(() => {
    body = {
      confirmPassword: 'SecurePassword123',
      email: 'info@motechdevelopment.co.uk',
      family_name: 'Gusbi',
      given_name: 'Mo',
      password: 'SecurePassword123',
    };
  });

  it('should validate with a valid input', async () => {
    await expect(register.validate(body)).resolves.toEqual({
      confirmPassword: 'SecurePassword123',
      email: 'info@motechdevelopment.co.uk',
      family_name: 'Gusbi',
      given_name: 'Mo',
      password: 'SecurePassword123',
    });
  });

  it('should throw if passwords to not match', async () => {
    body.confirmPassword = 'Hello';

    await expect(register.validate(body)).rejects.toThrowError(
      'Passwords to not match',
    );
  });

  it('should throw if password confirmation is not present', async () => {
    delete body.confirmPassword;

    await expect(register.validate(body)).rejects.toThrowError(
      'Please confirm your password',
    );
  });

  it('should throw if email is invalid', async () => {
    body.email = 'info[at]motechdevelopment.co.uk';

    await expect(register.validate(body)).rejects.toThrowError(
      'Please enter a valid email address',
    );
  });

  it('should throw if email is not present', async () => {
    delete body.email;

    await expect(register.validate(body)).rejects.toThrowError(
      'Email address is required',
    );
  });

  it('should throw if family name is not present', async () => {
    delete body.family_name;

    await expect(register.validate(body)).rejects.toThrowError(
      'Your surname is required',
    );
  });

  it('should throw if given name is not present', async () => {
    delete body.given_name;

    await expect(register.validate(body)).rejects.toThrowError(
      'Your forename is required',
    );
  });

  it('should throw if password is not present', async () => {
    body.confirmPassword = undefined;
    body.password = undefined;

    await expect(register.validate(body)).rejects.toThrowError(
      'Password is required',
    );
  });

  it('should throw if password is less than 8 characters long', async () => {
    body.confirmPassword = 'Passwor';
    body.password = 'Passwor';

    await expect(register.validate(body)).rejects.toThrowError(
      'Password must be at least 8 characters long',
    );
  });

  it('should throw if password is does not contain a uppercase letter', async () => {
    body.confirmPassword = 'password';
    body.password = 'password';

    await expect(register.validate(body)).rejects.toThrowError(
      'Password must contain at least one uppercase character',
    );
  });

  it('should throw if password is does not contain a lowercase letter', async () => {
    body.confirmPassword = 'PASSWORD';
    body.password = 'PASSWORD';

    await expect(register.validate(body)).rejects.toThrowError(
      'Password must contain at least one lowercase character',
    );
  });

  it('should throw if password is does not contain a number or special character', async () => {
    body.confirmPassword = 'SecurePassword';
    body.password = 'SecurePassword';

    await expect(register.validate(body)).rejects.toThrowError(
      'Password must contain at least 1 number or special character (!@#$%^&*)',
    );
  });
});
