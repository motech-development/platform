/* eslint-disable */
const auth0 = jest.createMockFromModule<any>('auth0-js');

auth0.WebAuth.prototype.redirect = {
  signupAndLogin: jest.fn(),
};

auth0.WebAuth.prototype.changePassword.mockImplementation(
  (_: unknown, cb: Function) => cb(),
);

auth0.WebAuth.prototype.login.mockImplementation((_: unknown, cb: Function) =>
  cb(),
);

auth0.WebAuth.prototype.signup.mockImplementation((_: unknown, cb: Function) =>
  cb(),
);

module.exports = auth0;

export {};
