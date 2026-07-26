import { useAuth0, User } from '@auth0/auth0-react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { Mock } from 'vitest';
import ProtectedRoute from '../ProtectedRoute';

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: vi.fn(),
}));

function TestComponent() {
  return <p data-testid="authenticated">Authenticated</p>;
}

describe('ProtectedRoute', () => {
  let buildAuthorizeUrl: Mock;
  let env: NodeJS.ProcessEnv;
  let getIdTokenClaims: Mock;
  let getTokenSilently: Mock;
  let isAuthenticated: boolean;
  let isLoading: boolean;
  let loginWithPopup: Mock;
  let loginWithRedirect: Mock;
  let logout: Mock;
  let user: User;

  beforeEach(() => {
    buildAuthorizeUrl = vi.fn();
    env = {
      ...process.env,
    };
    getIdTokenClaims = vi.fn();
    getTokenSilently = vi.fn();
    loginWithPopup = vi.fn();
    loginWithRedirect = vi.fn();
    logout = vi.fn();
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

    (useAuth0 as Mock).mockReturnValue({
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
          <Routes>
            <Route
              index
              element={<ProtectedRoute element={<TestComponent />} />}
            />
          </Routes>
        </MemoryRouter>
      );
    }

    const { queryByTestId } = render(<Component />);

    await waitFor(() => expect(queryByTestId('authenticated')).toBeNull());
  });

  it('should render component if authenticated', async () => {
    isLoading = false;
    isAuthenticated = true;

    (useAuth0 as Mock).mockReturnValue({
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
          <Routes>
            <Route
              index
              element={<ProtectedRoute element={<TestComponent />} />}
            />
          </Routes>
        </MemoryRouter>
      );
    }

    const { findByTestId } = render(<Component />);

    await expect(findByTestId('authenticated')).resolves.toBeInTheDocument();
  });

  it('should redirect to log in if not authenticated', async () => {
    isLoading = false;
    isAuthenticated = false;

    (useAuth0 as Mock).mockReturnValue({
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
          <Routes>
            <Route
              index
              element={
                <ProtectedRoute>
                  <TestComponent />
                </ProtectedRoute>
              }
            />
          </Routes>
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
