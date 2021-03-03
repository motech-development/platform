/* eslint-disable camelcase */
interface Auth0ClientOptions {
  client_id: string;
  domain: string;
}

export function Auth0Client() {}

Auth0Client.prototype.buildAuthorizeUrl = jest.fn();

Auth0Client.prototype.getIdTokenClaims = jest.fn().mockResolvedValue({
  __raw: 'claims',
  name: 'Mo Gusbi',
});

Auth0Client.prototype.getTokenSilently = jest
  .fn()
  .mockResolvedValue('JSON Web Token');

Auth0Client.prototype.getUser = jest.fn().mockResolvedValue({
  name: 'Mo Gusbi',
});

Auth0Client.prototype.handleRedirectCallback = jest.fn().mockResolvedValue({
  appState: {
    targetUrl: '/test-path',
  },
});

Auth0Client.prototype.isAuthenticated = jest.fn().mockResolvedValue(true);

Auth0Client.prototype.loginWithPopup = jest.fn();

Auth0Client.prototype.loginWithRedirect = jest.fn();

Auth0Client.prototype.logout = jest.fn();

const createAuth0Client = async ({ client_id }: Auth0ClientOptions) =>
  client_id === 'AUTH0_CLIENT_ID' ? new Auth0Client() : null;

export default createAuth0Client;
