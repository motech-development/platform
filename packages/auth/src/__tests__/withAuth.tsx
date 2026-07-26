import { useAuth0, User } from '@auth0/auth0-react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { Mock } from 'vitest';
import WithAuth from '../WithAuth';

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: vi.fn(),
}));

function TestComponent() {
  return <div data-testid="content">Loaded</div>;
}

function LoadingComponent() {
  return <div data-testid="loading">Loading</div>;
}

describe('withAuth', () => {
  let buildAuthorizeUrl: Mock;
  let env: NodeJS.ProcessEnv;
  let getIdTokenClaims: Mock;
  let getTokenSilently: Mock;
  let isAuthenticated: boolean;
  let isLoading: boolean;
  let loginWithPopup: Mock;
  let loginWithRedirect: Mock;
  let logout: Mock;
  let onError: Mock;
  let user: User;

  beforeEach(() => {
    buildAuthorizeUrl = vi.fn();
    env = {
      ...process.env,
    };
    getIdTokenClaims = vi.fn();
    getTokenSilently = vi.fn();
    isAuthenticated = false;
    loginWithPopup = vi.fn();
    loginWithRedirect = vi.fn();
    logout = vi.fn();
    onError = vi.fn();
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

  describe('when loaded', () => {
    beforeEach(() => {
      isLoading = false;
    });

    it('should show component', async () => {
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
            <WithAuth fallback={<LoadingComponent />} onError={onError}>
              <TestComponent />
            </WithAuth>
          </MemoryRouter>
        );
      }

      const { findByTestId } = render(<Component />);

      await expect(findByTestId('content')).resolves.toBeInTheDocument();
    });

    it('should handler error', async () => {
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
          <MemoryRouter
            initialEntries={['?error=Error&error_description=Message']}
          >
            <WithAuth fallback={<LoadingComponent />} onError={onError}>
              <TestComponent />
            </WithAuth>
          </MemoryRouter>
        );
      }

      render(<Component />);

      await waitFor(() => expect(onError).toHaveBeenCalledWith('Message'));
    });
  });

  describe('when not loaded', () => {
    it('should show the loader', async () => {
      isLoading = true;

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
            <WithAuth fallback={<LoadingComponent />} onError={onError}>
              <TestComponent />
            </WithAuth>
          </MemoryRouter>
        );
      }

      const { findByTestId } = render(<Component />);

      await expect(findByTestId('loading')).resolves.toBeInTheDocument();
    });
  });
});
