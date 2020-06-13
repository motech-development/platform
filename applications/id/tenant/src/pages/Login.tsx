import { useToast } from '@motech-development/breeze-ui';
import { Auth0Error } from 'auth0-js';
import React, { FC, lazy, memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/useAuth';
import getErrorMessage from '../utils/getErrorMessage';

const ForgottenPassword = lazy(() => import('./views/ForgottenPassword'));
const LogIn = lazy(() => import('./views/LogIn'));
const SignUp = lazy(() => import('./views/SignUp'));

const Login: FC = () => {
  const { add } = useToast();
  const { t } = useTranslation('validation');
  const [view, setView] = useState('log-in');
  const client = useAuth();
  const handleError = (e: Auth0Error | null) => {
    if (e) {
      const [useI18n, key] = getErrorMessage(e);

      add({
        colour: 'danger',
        message: useI18n ? t(`${view}.${key}`) : key,
      });
    }
  };

  useEffect(() => {
    if (!window.config) {
      const script = document.createElement('script');
      const scriptText = document.createTextNode(`
        try {
          window.config = JSON.parse(
            decodeURIComponent(escape(window.atob('@@config@@'))),
          );
        } catch (e) {}
      `);

      script.appendChild(scriptText);

      document.body.appendChild(script);
    }
  }, []);

  if (view === 'forgotten-password') {
    return <ForgottenPassword client={client} setView={setView} />;
  }

  if (view === 'sign-up') {
    return (
      <SignUp client={client} handleError={handleError} setView={setView} />
    );
  }

  return <LogIn client={client} handleError={handleError} setView={setView} />;
};

export default memo(Login);
