import { useAuth0, User } from '@auth0/auth0-react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';

jest.mock('@auth0/auth0-react', () => ({
  useAuth0: jest.fn(),
}));

function TestComponent() {
  return <p data-testid="authenticated">Authenticated</p>;
}

describe('ProtectedRoute', () => {
  let buildAuthorizeUrl: jest.Mock;
  let env: NodeJS.ProcessEnv;
  let getIdTokenClaims: jest.Mock;
  let getTokenSilently: jest.Mock;
  let isAuthenticated: boolean;
  let isLoading: boolean;
  let loginWithPopup: jest.Mock;
  let loginWithRedirect: jest.Mock;
  let logout: jest.Mock;
  let user: User;

  beforeEach(() => {
    buildAuthorizeUrl = jest.fn();
    env = {
      ...process.env,
    };
    getIdTokenClaims = jest.fn();
    getIdTokenClaims = jest.fn();
    loginWithPopup = jest.fn();
    loginWithRedirect = jest.fn();
    logout = jest.fn();
    process.env.NODE_ENV = 'development';
    process.env.REACT_APP_AUTH0_AUDIENCE = 'APP_AUTH0_AUDIENCE';
    process.env.REACT_APP_AUTH0_CLIENT_ID = 'AUTH0_CLIENT_ID';
    process.env.REACT_APP_AUTH0_DOMAIN = 'AUTH0_DOMAIN';
    user = {
      name: 'Mo Gusbi',
    };
  });

  afterEach(() => {
    process.env = env;
  });

  it('should not render component if not authenticated', async () => {
    isLoading = false;
    isAuthenticated = false;

    (useAuth0 as jest.Mock).mockReturnValue({
      buildAuthorizeUrl,
      getIdTokenClaims,
      getTokenSilently,
      isAuthenticated,
      isLoading,
      loginWithPopup,
      loginWithRedirect,
      logout,
      user,
    });

    function Component() {
      return (
        <MemoryRouter>
          <ProtectedRoute path="/" component={TestComponent} />
        </MemoryRouter>
      );
    }

    const { queryByTestId } = render(<Component />);

    await waitFor(() => expect(queryByTestId('authenticated')).toBeNull());
  });

  it('should render component if authenticated', async () => {
    isLoading = false;
    isAuthenticated = true;

    (useAuth0 as jest.Mock).mockReturnValue({
      buildAuthorizeUrl,
      getIdTokenClaims,
      getTokenSilently,
      isAuthenticated,
      isLoading,
      loginWithPopup,
      loginWithRedirect,
      logout,
      user,
    });

    function Component() {
      return (
        <MemoryRouter>
          <ProtectedRoute path="/" component={TestComponent} />
        </MemoryRouter>
      );
    }

    const { findByTestId } = render(<Component />);

    await expect(findByTestId('authenticated')).resolves.toBeInTheDocument();
  });

  it('should redirect to log in if not authenticated', async () => {
    isLoading = false;
    isAuthenticated = false;

    (useAuth0 as jest.Mock).mockReturnValue({
      buildAuthorizeUrl,
      getIdTokenClaims,
      getTokenSilently,
      isAuthenticated,
      isLoading,
      loginWithPopup,
      loginWithRedirect,
      logout,
      user,
    });

    function Component() {
      return (
        <MemoryRouter>
          <ProtectedRoute path="/" component={TestComponent} />
        </MemoryRouter>
      );
    }

    render(<Component />);

    await waitFor(() =>
      expect(loginWithRedirect).toHaveBeenCalledWith({
        appState: {
          targetUrl: '/',
        },
      }),
    );
  });
});
