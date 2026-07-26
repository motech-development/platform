// Adds custom DOM matchers such as toHaveTextContent.
import type { Mock } from 'vitest';
import '@testing-library/jest-dom/vitest';

type Auth0Method = (options: unknown, callback: () => void) => void;

class MockWebAuth {
  declare changePassword: Mock<Auth0Method>;

  declare login: Mock<Auth0Method>;

  declare redirect: {
    signupAndLogin: Mock;
  };

  declare signup: Mock<Auth0Method>;
}

vi.mock('auth0-js', async (importOriginal) => {
  const auth0 = await importOriginal<typeof import('auth0-js')>();

  MockWebAuth.prototype.redirect = {
    signupAndLogin: vi.fn(),
  };
  MockWebAuth.prototype.changePassword = vi.fn<Auth0Method>((_, callback) =>
    callback(),
  );
  MockWebAuth.prototype.login = vi.fn<Auth0Method>((_, callback) => callback());
  MockWebAuth.prototype.signup = vi.fn<Auth0Method>((_, callback) =>
    callback(),
  );

  return {
    ...auth0,
    WebAuth: MockWebAuth as unknown as typeof auth0.WebAuth,
  };
});
