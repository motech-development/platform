import { AuthContext, AuthProvider } from '@motech-development/auth';
import { ToastContext, ToastProvider } from '@motech-development/breeze-ui';
import i18n from 'i18next';
import React, { FC, ReactElement } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { Route, Router, Switch } from 'react-router-dom';
import { createMemoryHistory, MemoryHistory } from 'history';

export const buildAuthorizeUrl = jest.fn();

export const getIdTokenClaims = jest.fn();

export const getTokenSilently = jest.fn();

export const loginWithPopup = jest.fn();

export const loginWithRedirect = jest.fn();

export const logout = jest.fn();

export const add = jest.fn(({ onDismiss }) => {
  if (onDismiss) {
    onDismiss();
  }
});

export const remove = jest.fn();

export interface ITestProviderProps {
  children: ReactElement;
  isAuthenticated?: boolean;
  isLoading?: boolean;
  history?: MemoryHistory;
  path?: string;
  user?: object;
}

const TestProvider: FC<ITestProviderProps> = ({
  children,
  isAuthenticated = true,
  isLoading = false,
  path = '/',
  history = createMemoryHistory({
    initialEntries: [path],
  }),
  user = {
    name: 'Mo Gusbi',
    sub: 'user-id',
  },
}) => {
  const testI18n = i18n;

  testI18n.use(initReactI18next).init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    lng: 'en',
    resources: {
      en: {},
    },
  });

  return (
    <Router history={history}>
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
          <ToastProvider>
            <ToastContext.Provider
              value={{
                add,
                remove,
              }}
            >
              <I18nextProvider i18n={testI18n}>
                <Switch>
                  <Route exact path={path} component={() => children} />
                  <Route
                    path="*"
                    component={() => (
                      <div data-testid="next-page">The next page</div>
                    )}
                  />
                </Switch>
              </I18nextProvider>
            </ToastContext.Provider>
          </ToastProvider>
        </AuthContext.Provider>
      </AuthProvider>
    </Router>
  );
};

export default TestProvider;
