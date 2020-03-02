import { AuthContext, AuthProvider } from '@motech-development/auth';
import i18n from 'i18next';
import React, { FC, ReactElement } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { Router } from 'react-router-dom';
import history from '../history';

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  translations?: any;
}

const TestProvider: FC<ITestProviderProps> = ({
  children,
  isAuthenticated = true,
  isLoading = false,
  translations = {},
}) => {
  const testI18n = i18n;

  testI18n.use(initReactI18next).init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    lng: 'en',
    resources: {
      en: {
        ...translations,
      },
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
          <I18nextProvider i18n={testI18n}>{children}</I18nextProvider>
        </AuthContext.Provider>
      </AuthProvider>
    </Router>
  );
};

export default TestProvider;
