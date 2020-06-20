import { ToastContext, ToastProvider } from '@motech-development/breeze-ui';
import { render } from '@testing-library/react';
import React, { FC } from 'react';
import { MemoryRouter } from 'react-router-dom';
import AuthProvider, { AuthContext, AuthUser } from '../AuthProvider';
import withAuth from '../withAuth';

const add = jest.fn();
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

  it('should show the loader when Auth0 is loading', () => {
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

  it('should show component when Auth0 has loaded', async () => {
    isLoading = false;

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
});
