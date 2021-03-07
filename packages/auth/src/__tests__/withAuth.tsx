import { render, waitFor } from '@testing-library/react';
import { FC } from 'react';
import { MemoryRouter } from 'react-router-dom';
import AuthProvider, { AuthContext, AuthUser } from '../AuthProvider';
import WithAuth from '../WithAuth';

const TestComponent: FC = () => <div data-testid="content">Loaded</div>;
const LoadingComponent: FC = () => <div data-testid="loading">Loading</div>;

describe('withAuth', () => {
  let buildAuthorizeUrl: jest.Mock;
  let env: NodeJS.ProcessEnv;
  let getIdTokenClaims: jest.Mock;
  let getTokenSilently: jest.Mock;
  let isAuthenticated: boolean;
  let isLoading: boolean;
  let loginWithPopup: jest.Mock;
  let loginWithRedirect: jest.Mock;
  let logout: jest.Mock;
  let onError: jest.Mock;
  let user: AuthUser;

  beforeEach(() => {
    buildAuthorizeUrl = jest.fn();
    env = {
      ...process.env,
    };
    getIdTokenClaims = jest.fn();
    getIdTokenClaims = jest.fn();
    isAuthenticated = false;
    loginWithPopup = jest.fn();
    loginWithRedirect = jest.fn();
    logout = jest.fn();
    onError = jest.fn();
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
      const { findByTestId } = render(
        <MemoryRouter>
          <AuthProvider>
            <AuthContext.Provider
              value={{
                buildAuthorizeUrl,
                getIdTokenClaims,
                getTokenSilently,
                isAuthenticated,
                isLoading,
                loginWithPopup,
                loginWithRedirect,
                logout,
                user,
              }}
            >
              <WithAuth fallback={<LoadingComponent />} onError={onError}>
                <TestComponent />
              </WithAuth>
            </AuthContext.Provider>
          </AuthProvider>
        </MemoryRouter>,
      );

      await expect(findByTestId('content')).resolves.toBeInTheDocument();
    });

    it('should should handler error', async () => {
      render(
        <MemoryRouter
          initialEntries={['?error=Error&error_description=Message']}
        >
          <AuthProvider>
            <AuthContext.Provider
              value={{
                buildAuthorizeUrl,
                getIdTokenClaims,
                getTokenSilently,
                isAuthenticated,
                isLoading,
                loginWithPopup,
                loginWithRedirect,
                logout,
                user,
              }}
            >
              <WithAuth fallback={<LoadingComponent />} onError={onError}>
                <TestComponent />
              </WithAuth>
            </AuthContext.Provider>
          </AuthProvider>
        </MemoryRouter>,
      );

      await waitFor(() => expect(onError).toHaveBeenCalledWith('Message'));
    });
  });

  describe('when not loaded', () => {
    it('should show the loader', async () => {
      isLoading = true;

      const { findByTestId } = render(
        <MemoryRouter>
          <AuthProvider>
            <AuthContext.Provider
              value={{
                buildAuthorizeUrl,
                getIdTokenClaims,
                getTokenSilently,
                isAuthenticated,
                isLoading,
                loginWithPopup,
                loginWithRedirect,
                logout,
                user,
              }}
            >
              <WithAuth fallback={<LoadingComponent />} onError={onError}>
                <TestComponent />
              </WithAuth>
            </AuthContext.Provider>
          </AuthProvider>
        </MemoryRouter>,
      );

      await expect(findByTestId('loading')).resolves.toBeInTheDocument();
    });
  });
});
