/* eslint-disable camelcase */
interface Auth0ClientOptions {
  client_id: string;
  domain: string;
}

const createAuth0Client = async ({ client_id, domain }: Auth0ClientOptions) =>
  client_id === 'AUTH0_CLIENT_ID'
    ? {
        getIdTokenClaims: jest.fn().mockResolvedValue({
          __raw: 'claims',
          name: 'Mo Gusbi',
        }),
        getTokenSilently: jest.fn().mockResolvedValue('JSON Web Token'),
        getUser: jest.fn().mockResolvedValue({
          name: 'Mo Gusbi',
        }),
        handleRedirectCallback: jest.fn(),
        isAuthenticated: jest.fn().mockResolvedValue(domain === 'AUTH0_DOMAIN'),
        loginWithRedirect: jest.fn(),
        logout: jest.fn(),
      }
    : null;

export default createAuth0Client;
