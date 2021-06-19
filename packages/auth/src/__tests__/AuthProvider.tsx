import { Auth0Client } from '@auth0/auth0-spa-js';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { FC } from 'react';
import { MemoryRouter } from 'react-router-dom';
import AuthProvider, { AuthContext, AuthUser, useAuth } from '../AuthProvider';

const TestComponent: FC = () => {
  const { isAuthenticated, isLoading, loginWithRedirect, logout, user } =
    useAuth();

  return (
    <div data-testid="test-component">
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
    </div>
  );
};

describe('AuthProvider', () => {
  let buildAuthorizeUrl: jest.Mock;
  let env: NodeJS.ProcessEnv;
  let getIdTokenClaims: jest.Mock;
  let getTokenSilently: jest.Mock;
  let isAuthenticated: boolean;
  let isLoading: boolean;
  let loginWithPopup: jest.Mock;
  let loginWithRedirect: jest.Mock;
  let logout: jest.Mock;
  let user: AuthUser;

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
    user = {
      name: 'Mo Gusbi',
    };
  });

  afterEach(() => {
    process.env = env;
  });

  describe('when Auth0 is configured', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
      process.env.REACT_APP_AUTH0_AUDIENCE = 'APP_AUTH0_AUDIENCE';
      process.env.REACT_APP_AUTH0_CLIENT_ID = 'AUTH0_CLIENT_ID';
      process.env.REACT_APP_AUTH0_DOMAIN = 'AUTH0_DOMAIN';
    });

    it('should show loading message when loading', async () => {
      isLoading = true;
      isAuthenticated = false;

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
      (
        Auth0Client.prototype.isAuthenticated as jest.Mock
      ).mockResolvedValueOnce(false);

      const { findByTestId } = render(
        <MemoryRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </MemoryRouter>,
      );

      const result = await waitFor(() => findByTestId('log-in'));

      expect(result).toBeInTheDocument();
    });

    it('should handle redirect callback', async () => {
      window.history.replaceState = jest.fn();
      document.title = 'Hello world';

      const { findByTestId } = render(
        <MemoryRouter initialEntries={['?code=test']}>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </MemoryRouter>,
      );

      const result = await waitFor(() => findByTestId('user'));

      expect(window.history.replaceState).toHaveBeenCalledWith(
        {},
        'Hello world',
        '/',
      );
      expect(result).toHaveTextContent('Mo Gusbi');
    });

    it('should call logout', async () => {
      const { findByTestId } = render(
        <MemoryRouter initialEntries={['?code=test']}>
          <AuthProvider>
            <AuthContext.Consumer>
              {(ctx) => (
                <>
                  <button
                    type="button"
                    data-testid="no-opts"
                    onClick={() => ctx!.logout()}
                  >
                    No opts
                  </button>
                  <button
                    type="button"
                    data-testid="with-opts"
                    onClick={() =>
                      ctx!.logout({
                        returnTo: 'test',
                      })
                    }
                  >
                    With opts
                  </button>
                </>
              )}
            </AuthContext.Consumer>
          </AuthProvider>
        </MemoryRouter>,
      );
      const noOpts = await findByTestId('no-opts');
      const withOpts = await findByTestId('with-opts');

      fireEvent.click(noOpts);
      fireEvent.click(withOpts);

      expect(Auth0Client.prototype.logout).toHaveBeenCalledWith(undefined);
      expect(Auth0Client.prototype.logout).toHaveBeenCalledWith({
        returnTo: 'test',
      });
    });

    it('should call loginWithPopup', async () => {
      (
        Auth0Client.prototype.isAuthenticated as jest.Mock
      ).mockResolvedValueOnce(false);

      const { findByTestId } = render(
        <MemoryRouter initialEntries={['?code=test']}>
          <AuthProvider>
            <AuthContext.Consumer>
              {(ctx) => (
                <>
                  <button
                    type="button"
                    data-testid="no-opts"
                    onClick={() => ctx!.loginWithPopup()}
                  >
                    No opts
                  </button>
                  <button
                    type="button"
                    data-testid="with-opts"
                    onClick={() =>
                      ctx!.loginWithPopup({
                        audience: 'test',
                      })
                    }
                  >
                    With opts
                  </button>
                </>
              )}
            </AuthContext.Consumer>
          </AuthProvider>
        </MemoryRouter>,
      );
      const noOpts = await findByTestId('no-opts');
      const withOpts = await findByTestId('with-opts');

      fireEvent.click(noOpts);
      fireEvent.click(withOpts);

      expect(Auth0Client.prototype.loginWithPopup).toHaveBeenCalledWith(
        undefined,
      );
      expect(Auth0Client.prototype.loginWithPopup).toHaveBeenCalledWith({
        audience: 'test',
      });
    });

    it('should call loginWithRedirect', async () => {
      (
        Auth0Client.prototype.isAuthenticated as jest.Mock
      ).mockResolvedValueOnce(false);

      const { findByTestId } = render(
        <MemoryRouter initialEntries={['?code=test']}>
          <AuthProvider>
            <AuthContext.Consumer>
              {(ctx) => (
                <>
                  <button
                    type="button"
                    data-testid="no-opts"
                    onClick={() => ctx!.loginWithRedirect()}
                  >
                    No opts
                  </button>
                  <button
                    type="button"
                    data-testid="with-opts"
                    onClick={() =>
                      ctx!.loginWithRedirect({
                        audience: 'test',
                      })
                    }
                  >
                    With opts
                  </button>
                </>
              )}
            </AuthContext.Consumer>
          </AuthProvider>
        </MemoryRouter>,
      );
      const noOpts = await findByTestId('no-opts');
      const withOpts = await findByTestId('with-opts');

      fireEvent.click(noOpts);
      fireEvent.click(withOpts);

      expect(Auth0Client.prototype.loginWithRedirect).toHaveBeenCalledWith(
        undefined,
      );
      expect(Auth0Client.prototype.loginWithRedirect).toHaveBeenCalledWith({
        audience: 'test',
      });
    });

    it('should call buildAuthorizeUrl', async () => {
      (
        Auth0Client.prototype.isAuthenticated as jest.Mock
      ).mockResolvedValueOnce(false);

      const { findByTestId } = render(
        <MemoryRouter initialEntries={['?code=test']}>
          <AuthProvider>
            <AuthContext.Consumer>
              {(ctx) => (
                <>
                  <button
                    type="button"
                    data-testid="no-opts"
                    onClick={() => ctx!.buildAuthorizeUrl()}
                  >
                    No opts
                  </button>
                  <button
                    type="button"
                    data-testid="with-opts"
                    onClick={() =>
                      ctx!.buildAuthorizeUrl({
                        audience: 'test',
                      })
                    }
                  >
                    With opts
                  </button>
                </>
              )}
            </AuthContext.Consumer>
          </AuthProvider>
        </MemoryRouter>,
      );
      const noOpts = await findByTestId('no-opts');
      const withOpts = await findByTestId('with-opts');

      fireEvent.click(noOpts);
      fireEvent.click(withOpts);

      expect(Auth0Client.prototype.buildAuthorizeUrl).toHaveBeenCalledWith(
        undefined,
      );
      expect(Auth0Client.prototype.buildAuthorizeUrl).toHaveBeenCalledWith({
        audience: 'test',
      });
    });

    it('should call getIdTokenClaims', async () => {
      (
        Auth0Client.prototype.isAuthenticated as jest.Mock
      ).mockResolvedValueOnce(false);

      const { findByTestId } = render(
        <MemoryRouter initialEntries={['?code=test']}>
          <AuthProvider>
            <AuthContext.Consumer>
              {(ctx) => (
                <>
                  <button
                    type="button"
                    data-testid="no-opts"
                    onClick={() => ctx!.getIdTokenClaims()}
                  >
                    No opts
                  </button>
                  <button
                    type="button"
                    data-testid="with-opts"
                    onClick={() =>
                      ctx!.getIdTokenClaims({
                        audience: 'test',
                      })
                    }
                  >
                    With opts
                  </button>
                </>
              )}
            </AuthContext.Consumer>
          </AuthProvider>
        </MemoryRouter>,
      );
      const noOpts = await findByTestId('no-opts');
      const withOpts = await findByTestId('with-opts');

      fireEvent.click(noOpts);
      fireEvent.click(withOpts);

      expect(Auth0Client.prototype.getIdTokenClaims).toHaveBeenCalledWith(
        undefined,
      );
      expect(Auth0Client.prototype.getIdTokenClaims).toHaveBeenCalledWith({
        audience: 'test',
      });
    });

    it('should call getTokenSilently', async () => {
      (
        Auth0Client.prototype.isAuthenticated as jest.Mock
      ).mockResolvedValueOnce(false);

      const { findByTestId } = render(
        <MemoryRouter initialEntries={['?code=test']}>
          <AuthProvider>
            <AuthContext.Consumer>
              {(ctx) => (
                <>
                  <button
                    type="button"
                    data-testid="no-opts"
                    onClick={() => ctx!.getTokenSilently()}
                  >
                    No opts
                  </button>
                  <button
                    type="button"
                    data-testid="with-opts"
                    onClick={() =>
                      ctx!.getTokenSilently({
                        audience: 'test',
                      })
                    }
                  >
                    With opts
                  </button>
                </>
              )}
            </AuthContext.Consumer>
          </AuthProvider>
        </MemoryRouter>,
      );
      const noOpts = await findByTestId('no-opts');
      const withOpts = await findByTestId('with-opts');

      fireEvent.click(noOpts);
      fireEvent.click(withOpts);

      expect(Auth0Client.prototype.getTokenSilently).toHaveBeenCalledWith(
        undefined,
      );
      expect(Auth0Client.prototype.getTokenSilently).toHaveBeenCalledWith({
        audience: 'test',
      });
    });
  });

  describe('when Auth0 is not configured', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    it('should now show content when client is not present', () => {
      const { queryByTestId } = render(
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
              <TestComponent />
            </AuthContext.Provider>
          </AuthProvider>
        </MemoryRouter>,
      );

      expect(queryByTestId('test-component')).not.toBeInTheDocument();
    });
  });

  describe('when in test mode', () => {
    it('should show loading message', async () => {
      isLoading = true;
      isAuthenticated = false;

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
