import { AuthContext, AuthProvider } from '@motech-development/auth';
import i18n from 'i18next';
import React, { FC, ReactElement } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { Route, Router, Switch } from 'react-router-dom';
import { createMemoryHistory, MemoryHistory } from 'history';

export const getIdTokenClaims = jest.fn();

export const getTokenSilently = jest.fn();

export const loginWithRedirect = jest.fn();

export const logout = jest.fn();

export const add = jest.fn();

export const remove = jest.fn();

export interface ITestProviderProps {
  children: ReactElement;
  isAuthenticated?: boolean;
  isLoading?: boolean;
  history?: MemoryHistory;
  path?: string;
  user?: object | null;
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
            getIdTokenClaims,
            getTokenSilently,
            isAuthenticated,
            isLoading,
            loginWithRedirect,
            logout,
            user: user === null ? undefined : user,
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
        </AuthContext.Provider>
      </AuthProvider>
    </Router>
  );
};

export default TestProvider;
