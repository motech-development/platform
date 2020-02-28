import { fireEvent, render, waitForElement } from '@testing-library/react';
import React, { FC } from 'react';
import { MemoryRouter } from 'react-router-dom';
import AuthProvider, { AuthContext, AuthUser, useAuth } from '../AuthProvider';

const TestComponent: FC = () => {
  const {
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    user,
  } = useAuth();

  return (
    <>
      {isLoading ? (
        <div data-testid="loading">Loading...</div>
      ) : (
        <>
          {isAuthenticated ? (
            <>
              <div data-testid="user">{user?.name}</div>

              <button
                type="button"
                data-testid="log-out"
                onClick={() =>
                  logout({
                    returnTo: 'somewhere',
                  })
                }
              >
                Log out
              </button>
            </>
          ) : (
            <button
              type="button"
              data-testid="log-in"
              onClick={loginWithRedirect}
            >
              Log in
            </button>
          )}
        </>
      )}
    </>
  );
};

describe('AuthProvider', () => {
  let getIdTokenClaims: jest.Mock;
  let getTokenSilently: jest.Mock;
  let isAuthenticated: boolean;
  let isLoading: boolean;
  let loginWithRedirect: jest.Mock;
  let logout: jest.Mock;
  let user: AuthUser;

  beforeEach(() => {
    getIdTokenClaims = jest.fn();
    getIdTokenClaims = jest.fn();
    loginWithRedirect = jest.fn();
    logout = jest.fn();
    user = {
      name: 'Mo Gusbi',
    };
  });

  describe('when Auth0 is configured', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.NODE_ENV = 'development';
      process.env.REACT_APP_AUTH0_CLIENT_ID = 'AUTH0_CLIENT_ID';
      process.env.REACT_APP_AUTH0_DOMAIN = 'AUTH0_DOMAIN';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should show loading message when loading', async () => {
      isLoading = true;
      isAuthenticated = false;

      const { findByTestId } = render(
        <MemoryRouter>
          <AuthProvider>
            <AuthContext.Provider
              value={{
                getIdTokenClaims,
                getTokenSilently,
                isAuthenticated,
                isLoading,
                loginWithRedirect,
                logout,
                user,
              }}
            >
              <TestComponent />
            </AuthContext.Provider>
          </AuthProvider>
        </MemoryRouter>,
      );

      await expect(findByTestId('loading')).resolves.toHaveTextContent(
        'Loading...',
      );
    });

    it('should show user details and log out button when authorised', async () => {
      isLoading = false;
      isAuthenticated = true;

      const { findByTestId } = render(
        <MemoryRouter>
          <AuthProvider>
            <AuthContext.Provider
              value={{
                getIdTokenClaims,
                getTokenSilently,
                isAuthenticated,
                isLoading,
                loginWithRedirect,
                logout,
                user,
              }}
            >
              <TestComponent />
            </AuthContext.Provider>
          </AuthProvider>
        </MemoryRouter>,
      );
      const logOutButton = await findByTestId('log-out');

      fireEvent.click(logOutButton);

      expect(logout).toHaveBeenCalledWith({
        returnTo: 'somewhere',
      });

      await expect(findByTestId('user')).resolves.toHaveTextContent('Mo Gusbi');
    });

    it('should show log in button when not authorisd', async () => {
      isLoading = false;
      isAuthenticated = false;

      const { findByTestId } = render(
        <MemoryRouter>
          <AuthProvider>
            <AuthContext.Provider
              value={{
                getIdTokenClaims,
                getTokenSilently,
                isAuthenticated,
                isLoading,
                loginWithRedirect,
                logout,
                user,
              }}
            >
              <TestComponent />
            </AuthContext.Provider>
          </AuthProvider>
        </MemoryRouter>,
      );
      const logInButton = await findByTestId('log-in');

      fireEvent.click(logInButton);

      expect(loginWithRedirect).toHaveBeenCalled();
    });

    it("should show log in button when auth0 says you're not authorised", async () => {
      process.env.REACT_APP_AUTH0_DOMAIN = 'FAKE_DOMAIN';

      const { findByTestId } = render(
        <MemoryRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </MemoryRouter>,
      );

      const result = await waitForElement(() => findByTestId('log-in'));

      expect(result).toBeInTheDocument();
    });

    it('should handle redirect callback', async () => {
      window.history.replaceState = jest.fn();
      document.title = 'Hello world';

      isLoading = false;
      isAuthenticated = false;

      const { findByTestId } = render(
        <MemoryRouter initialEntries={['?code=test']}>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </MemoryRouter>,
      );

      const result = await waitForElement(() => findByTestId('user'));

      expect(window.history.replaceState).toHaveBeenCalledWith(
        {},
        'Hello world',
        '/',
      );
      expect(result).toHaveTextContent('Mo Gusbi');
    });
  });

  describe('when Auth0 is not configured', () => {
    it('should show loading message', async () => {
      isLoading = true;
      isAuthenticated = false;

      const { findByTestId } = render(
        <MemoryRouter>
          <AuthProvider>
            <AuthContext.Provider
              value={{
                getIdTokenClaims,
                getTokenSilently,
                isAuthenticated,
                isLoading,
                loginWithRedirect,
                logout,
                user,
              }}
            >
              <TestComponent />
            </AuthContext.Provider>
          </AuthProvider>
        </MemoryRouter>,
      );

      await expect(findByTestId('loading')).resolves.toHaveTextContent(
        'Loading...',
      );
    });
  });
});
