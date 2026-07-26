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
import type { Mock } from 'vitest';

export const getAccessTokenSilently = vi.fn();

export const getAccessTokenWithPopup = vi.fn();

export const getIdTokenClaims = vi.fn();

export const handleRedirectCallback = vi.fn();

export const loginWithPopup = vi.fn();

export const loginWithRedirect = vi.fn();

export const logout = vi.fn();

export const add = vi.fn<(toast: IAddToast) => void>(({ onDismiss }) => {
  if (onDismiss) {
    onDismiss();
  }
});

export const remove = vi.fn();

export interface IMockFetchResponseOptions {
  body?: Blob | string | null;
  contentType?: string;
  ok?: boolean;
  status?: number;
  statusText?: string;
}

export const createFetchResponse = ({
  body = '',
  contentType,
  ok = true,
  status = 200,
  statusText = '',
}: IMockFetchResponseOptions = {}) => ({
  arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
  blob: vi.fn().mockResolvedValue(body ?? ''),
  headers: {
    get: vi.fn((name: string) =>
      name.toLowerCase() === 'content-type' ? contentType : undefined,
    ),
  },
  ok,
  status,
  statusText,
  text: vi.fn().mockResolvedValue(typeof body === 'string' ? body : ''),
});

interface IMockAuth0 {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: object;
}

function mockAuth0({ isAuthenticated, isLoading, user }: IMockAuth0) {
  (useAuth0 as Mock).mockReturnValue({
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
    <MemoryRouter
      initialEntries={history}
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
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
