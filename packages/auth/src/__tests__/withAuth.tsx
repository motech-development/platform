import { ToastContext, ToastProvider } from '@motech-development/breeze-ui';
import { act, render, wait } from '@testing-library/react';
import React, { FC } from 'react';
import { MemoryRouter } from 'react-router-dom';
import AuthProvider, { AuthContext, AuthUser } from '../AuthProvider';
import withAuth from '../withAuth';

const add = jest.fn(({ onDismiss }) => onDismiss());
const remove = jest.fn();
const TestComponent: FC = () => <div data-testid="content">Loaded</div>;
const WrappedComponent = withAuth(TestComponent);

describe('withAuth', () => {
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
    isAuthenticated = false;
    loginWithRedirect = jest.fn();
    logout = jest.fn();
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
              <ToastProvider>
                <ToastContext.Provider
                  value={{
                    add,
                    remove,
                  }}
                >
                  <WrappedComponent />
                </ToastContext.Provider>
              </ToastProvider>
            </AuthContext.Provider>
          </AuthProvider>
        </MemoryRouter>,
      );

      await expect(findByTestId('content')).resolves.toBeInTheDocument();
    });

    it('should show a toast and log out if an error occurs', async () => {
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
              <ToastProvider>
                <ToastContext.Provider
                  value={{
                    add,
                    remove,
                  }}
                >
                  <WrappedComponent />
                </ToastContext.Provider>
              </ToastProvider>
            </AuthContext.Provider>
          </AuthProvider>
        </MemoryRouter>,
      );

      jest.useFakeTimers();

      act(() => {
        jest.runAllTimers();
      });

      await wait(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'danger',
          message: 'Message',
          onDismiss: expect.any(Function),
        }),
      );

      expect(logout).toHaveBeenCalledWith({
        returnTo: window.location.origin,
      });
    });
  });

  describe('when not loaded', () => {
    it('should show the loader', () => {
      isLoading = true;

      const { container } = render(
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
              <ToastProvider>
                <ToastContext.Provider
                  value={{
                    add,
                    remove,
                  }}
                >
                  <WrappedComponent />
                </ToastContext.Provider>
              </ToastProvider>
            </AuthContext.Provider>
          </AuthProvider>
        </MemoryRouter>,
      );
      const loader = container.querySelector('circle');

      expect(loader).toBeInTheDocument();
    });
  });
});
