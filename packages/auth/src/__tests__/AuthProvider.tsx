import { fireEvent, render } from '@testing-library/react';
import React, { FC } from 'react';
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
  describe('when Auth0 is configured', () => {
    let env: NodeJS.ProcessEnv;
    let getIdTokenClaims: jest.Mock;
    let getTokenSilently: jest.Mock;
    let isAuthenticated: boolean;
    let isLoading: boolean;
    let loginWithRedirect: jest.Mock;
    let logout: jest.Mock;
    let user: AuthUser;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.REACT_APP_AUTH0_CLIENT_ID = 'AUTH0_CLIENT_ID';
      process.env.REACT_APP_AUTH0_DOMAIN = 'AUTH0_DOMAIN';

      getIdTokenClaims = jest.fn();
      getIdTokenClaims = jest.fn();
      loginWithRedirect = jest.fn();
      logout = jest.fn();
      user = {
        name: 'Mo Gusbi',
      };
    });

    afterEach(() => {
      process.env = env;
    });

    it('should show loading message when loading', async () => {
      isLoading = true;
      isAuthenticated = false;

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

      await expect(findByTestId('loading')).resolves.toHaveTextContent(
        'Loading...',
      );
    });

    it('should show user details and log out button when authorised', async () => {
      isLoading = false;
      isAuthenticated = true;

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

      fireEvent.click(logInButton);

      expect(loginWithRedirect).toHaveBeenCalled();
    });
  });

  // it('should return values from Auth0', async () => {
  //   const { findByTestId } = render(
  //     <AuthProvider>
  //       <AuthContext.Consumer>
  //         {value => (
  //           <>
  //             <div data-testid="loaded">{!value?.isLoading && 'Loaded'}</div>
  //             <div data-testid="authenticated">
  //               {value?.isAuthenticated && 'Authenticated'}
  //             </div>
  //             <div data-testid="user">{value?.user?.name}</div>
  //           </>
  //         )}
  //       </AuthContext.Consumer>
  //     </AuthProvider>,
  //   );

  //   await expect(findByTestId('loaded')).resolves.toHaveTextContent('Loaded');
  //   await expect(findByTestId('authenticated')).resolves.toHaveTextContent(
  //     'Authenticated',
  //   );
  //   await expect(findByTestId('user')).resolves.toHaveTextContent('Mo Gusbi');
  // });

  // it('should call Auth0', async () => {
  //   const getIdTokenClaims = jest.fn();
  //   const getTokenSilently = jest.fn();
  //   const isAuthenticated = true;
  //   const isLoading = false;
  //   const loginWithRedirect = jest.fn();
  //   const logout = jest.fn();
  //   const user = jest.fn();

  //   const { findByTestId } = render(
  //     <AuthProvider>
  //       <AuthContext.Provider
  //         value={{
  //           getIdTokenClaims,
  //           getTokenSilently,
  //           isAuthenticated,
  //           isLoading,
  //           loginWithRedirect,
  //           logout,
  //           user,
  //         }}
  //       >
  //         <TestComponent />
  //       </AuthContext.Provider>
  //     </AuthProvider>,
  //   );
  //   const logInButton = await findByTestId('log-in');
  //   const logOutButton = await findByTestId('log-out');

  //   fireEvent.click(logInButton);
  //   fireEvent.click(logOutButton);

  //   expect(loginWithRedirect).toHaveBeenCalled();
  //   expect(logout).toHaveBeenCalledWith({
  //     returnTo: 'somewhere',
  //   });
  // });
});
