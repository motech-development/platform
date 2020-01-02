const createAuth0Client = jest.fn().mockResolvedValue({
  getIdTokenClaims: jest.fn().mockResolvedValue({
    __raw: 'claims',
    name: 'Mo Gusbi',
  }),
  getTokenSilently: jest.fn().mockResolvedValue('JSON Web Token'),
  getUser: jest.fn().mockResolvedValue({
    name: 'Mo Gusbi',
  }),
  handleRedirectCallback: jest.fn(),
  isAuthenticated: jest.fn().mockResolvedValue(true),
  loginWithRedirect: jest.fn(),
  logout: jest.fn(),
});

export default createAuth0Client;
