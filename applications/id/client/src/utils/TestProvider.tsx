import { ToastContext, ToastProvider } from '@motech-development/breeze-ui';
import i18n from 'i18next';
import { FC, ReactNode, Suspense } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';

export const add = jest.fn();

export const remove = jest.fn();

export interface ITestProviderProps {
  children: ReactNode;
}

const TestProvider: FC<ITestProviderProps> = ({ children }) => {
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
    <ToastProvider>
      <ToastContext.Provider
        value={{
          add,
          remove,
        }}
      >
        <I18nextProvider i18n={testI18n}>
          <Suspense fallback={<div />}>{children}</Suspense>
        </I18nextProvider>
      </ToastContext.Provider>
    </ToastProvider>
  );
};

export default TestProvider;
