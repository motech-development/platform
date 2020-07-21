import { render, wait } from '@testing-library/react';
import React, { FC } from 'react';
import { MemoryRouter } from 'react-router-dom';
import AuthProvider, { AuthContext, AuthUser } from '../AuthProvider';
import WithAuth from '../WithAuth';

const TestComponent: FC = () => <div data-testid="content">Loaded</div>;
const LoadingComponent: FC = () => <div data-testid="loading">Loading</div>;

describe('withAuth', () => {
  let getIdTokenClaims: jest.Mock;
  let getTokenSilently: jest.Mock;
  let isAuthenticated: boolean;
  let isLoading: boolean;
  let loginWithRedirect: jest.Mock;
  let logout: jest.Mock;
  let onError: jest.Mock;
  let user: AuthUser;

  beforeEach(() => {
    getIdTokenClaims = jest.fn();
    getIdTokenClaims = jest.fn();
    isAuthenticated = false;
    loginWithRedirect = jest.fn();
    logout = jest.fn();
    onError = jest.fn();
    user = {
      name: 'Mo Gusbi',
    };
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
                getIdTokenClaims,
                getTokenSilently,
                isAuthenticated,
                isLoading,
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
                getIdTokenClaims,
                getTokenSilently,
                isAuthenticated,
                isLoading,
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

      await wait(() => expect(onError).toHaveBeenCalledWith('Message'));
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
                getIdTokenClaims,
                getTokenSilently,
                isAuthenticated,
                isLoading,
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
