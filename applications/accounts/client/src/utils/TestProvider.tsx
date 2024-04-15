import { useAuth0 } from '@auth0/auth0-react';
import {
  IAddToast,
  ToastContext,
  ToastProvider,
} from '@motech-development/breeze-ui';
import i18n from 'i18next';
import { ReactElement, useMemo } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

jest.mock('@auth0/auth0-react');

export const getAccessTokenSilently = jest.fn();

export const getAccessTokenWithPopup = jest.fn();

export const getIdTokenClaims = jest.fn();

export const handleRedirectCallback = jest.fn();

export const loginWithPopup = jest.fn();

export const loginWithRedirect = jest.fn();

export const logout = jest.fn();

export const add = jest.fn<void, IAddToast[]>(({ onDismiss }) => {
  if (onDismiss) {
    onDismiss();
  }
});

export const remove = jest.fn();

interface IMockAuth0 {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: object;
}

function mockAuth0({ isAuthenticated, isLoading, user }: IMockAuth0) {
  (useAuth0 as jest.Mock).mockReturnValue({
    getAccessTokenSilently,
    getAccessTokenWithPopup,
    getIdTokenClaims,
    handleRedirectCallback,
    isAuthenticated,
    isLoading,
    loginWithPopup,
    loginWithRedirect,
    logout,
    user,
  });
}

export interface ITestProviderProps {
  children: ReactElement;
  isAuthenticated?: boolean;
  isLoading?: boolean;
  history?: string[];
  path?: string;
  user?: object;
}

function TestRoute() {
  const location = useLocation();

  return (
    <div data-testid="next-page">
      <span data-testid={location.pathname}>The next page</span>
    </div>
  );
}

function TestProvider({
  children,
  isAuthenticated = true,
  isLoading = false,
  path = '/',
  history = [path],
  user = {
    name: 'Mo Gusbi',
    sub: 'user-id',
  },
}: ITestProviderProps) {
  mockAuth0({
    isAuthenticated,
    isLoading,
    user,
  });

  const testI18n = i18n;

  testI18n
    .use(initReactI18next)
    .init({
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      lng: 'en',
      resources: {
        en: {},
      },
    })
    .catch(() => {});

  const toastProvider = useMemo(
    () => ({
      add,
      remove,
    }),
    [],
  );

  return (
    <MemoryRouter initialEntries={history}>
      <ToastProvider>
        <ToastContext.Provider value={toastProvider}>
          <I18nextProvider i18n={testI18n}>
            <Routes>
              <Route path={path} element={<>{children}</>} />
              <Route path="*" element={<TestRoute />} />
            </Routes>
          </I18nextProvider>
        </ToastContext.Provider>
      </ToastProvider>
    </MemoryRouter>
  );
}

export default TestProvider;
