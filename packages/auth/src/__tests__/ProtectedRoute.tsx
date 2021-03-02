import { render, wait } from '@testing-library/react';
import React, { FC } from 'react';
import { MemoryRouter } from 'react-router-dom';
import AuthProvider, { AuthContext, AuthUser } from '../AuthProvider';
import ProtectedRoute from '../ProtectedRoute';

const TestComponent: FC = () => (
  <p data-testid="authenticated">Authenticated</p>
);

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
            <ProtectedRoute path="/" component={TestComponent} />
          </AuthContext.Provider>
        </AuthProvider>
      </MemoryRouter>,
    );

    await wait(() => expect(queryByTestId('authenticated')).toBeNull());
  });

  it('should render component if authenticated', async () => {
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
            <ProtectedRoute path="/" component={TestComponent} />
          </AuthContext.Provider>
        </AuthProvider>
      </MemoryRouter>,
    );

    await expect(findByTestId('authenticated')).resolves.toBeInTheDocument();
  });

  it('should redirect to log in if not authenticated', async () => {
    isLoading = false;
    isAuthenticated = false;

    render(
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
            <ProtectedRoute path="/" component={TestComponent} />
          </AuthContext.Provider>
        </AuthProvider>
      </MemoryRouter>,
    );

    await wait(() =>
      expect(loginWithRedirect).toHaveBeenCalledWith({
        appState: {
          targetUrl: '/',
        },
      }),
    );
  });
});
