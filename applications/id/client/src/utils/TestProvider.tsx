import { ToastContext, ToastProvider } from '@motech-development/breeze-ui';
import i18n from 'i18next';
import { ReactNode, Suspense, useMemo } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';

export const add = jest.fn();

export const remove = jest.fn();

export interface ITestProviderProps {
  children: ReactNode;
}

function TestProvider({ children }: ITestProviderProps) {
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

  const ctx = useMemo(
    () => ({
      add,
      remove,
    }),
    [],
  );

  return (
    <ToastProvider>
      <ToastContext.Provider value={ctx}>
        <I18nextProvider i18n={testI18n}>
          <Suspense fallback={<div />}>{children}</Suspense>
        </I18nextProvider>
      </ToastContext.Provider>
    </ToastProvider>
  );
}

export default TestProvider;
