import { AuthContext, AuthProvider } from '@motech-development/auth';
import i18n from 'i18next';
import React, { FC, ReactElement } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { Route, Router } from 'react-router-dom';
import { createMemoryHistory, MemoryHistory } from 'history';

const user = {
  name: 'Mo Gusbi',
};

export const getIdTokenClaims = jest.fn();

export const getTokenSilently = jest.fn();

export const loginWithRedirect = jest.fn();

export const logout = jest.fn();

export interface ITestProviderProps {
  children: ReactElement;
  isAuthenticated?: boolean;
  isLoading?: boolean;
  history?: MemoryHistory;
  path?: string;
}

const TestProvider: FC<ITestProviderProps> = ({
  children,
  isAuthenticated = true,
  isLoading = false,
  path = '/',
  history = createMemoryHistory({
    initialEntries: [path],
  }),
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
            user,
          }}
        >
          <I18nextProvider i18n={testI18n}>
            <Route exact path={path} component={() => children} />
            <Route path="*" component={() => null} />
          </I18nextProvider>
        </AuthContext.Provider>
      </AuthProvider>
    </Router>
  );
};

export default TestProvider;
