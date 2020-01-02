import { fireEvent, render } from '@testing-library/react';
import React, { FC } from 'react';
import AuthProvider, { AuthContext, useAuth } from '../AuthProvider';

const TestComponent: FC = () => {
  const { loginWithRedirect, logout } = useAuth();

  return (
    <>
      <button type="button" data-testid="log-in" onClick={loginWithRedirect}>
        Log in
      </button>

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
  );
};

describe('AuthProvider', () => {
  let env: NodeJS.ProcessEnv;

  beforeEach(() => {
    env = {
      ...process.env,
    };

    process.env.REACT_APP_AUTH0_CLIENT_ID = 'AUTH0_CLIENT_ID';
    process.env.REACT_APP_AUTH0_DOMAIN = 'AUTH0_DOMAIN';
  });

  afterEach(() => {
    process.env = env;
  });

  it('should return values from Auth0', async () => {
    const { findByTestId } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {value => (
            <>
              <div data-testid="loaded">{!value?.isLoading && 'Loaded'}</div>
              <div data-testid="authenticated">
                {value?.isAuthenticated && 'Authenticated'}
              </div>
              <div data-testid="user">{value?.user?.name}</div>
            </>
          )}
        </AuthContext.Consumer>
      </AuthProvider>,
    );

    await expect(findByTestId('loaded')).resolves.toHaveTextContent('Loaded');
    await expect(findByTestId('authenticated')).resolves.toHaveTextContent(
      'Authenticated',
    );
    await expect(findByTestId('user')).resolves.toHaveTextContent('Mo Gusbi');
  });

  it('should call Auth0', async () => {
    const getIdTokenClaims = jest.fn();
    const getTokenSilently = jest.fn();
    const isAuthenticated = true;
    const isLoading = false;
    const loginWithRedirect = jest.fn();
    const logout = jest.fn();
    const user = jest.fn();

    const { findByTestId } = render(
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
      </AuthProvider>,
    );
    const logInButton = await findByTestId('log-in');
    const logOutButton = await findByTestId('log-out');

    fireEvent.click(logInButton);
    fireEvent.click(logOutButton);

    expect(loginWithRedirect).toHaveBeenCalled();
    expect(logout).toHaveBeenCalledWith({
      returnTo: 'somewhere',
    });
  });
});
