// TODO: Titles for views
// TODO: Reset password form
import { useToast } from '@motech-development/breeze-ui';
import { Auth0Error } from 'auth0-js';
import React, { FC, lazy, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LogIn = lazy(() => import('./views/LogIn'));
const SignUp = lazy(() => import('./views/SignUp'));

const getErrorMessage = (e: Auth0Error | null): [boolean, string] => {
  if (e) {
    const useLocal = [
      'access_denied',
      'invalid_user_password',
      'unauthorized',
    ].includes(e.error);
    const useFallback = [
      'invalid_signup',
      'mfa_required',
      'PasswordHistoryError',
    ].includes(e.error);

    if (useLocal) {
      return [false, e.description as string];
    }

    return useFallback ? [true, 'fallback'] : [true, e.code as string];
  }

  return [true, 'fallback'];
};

const Index: FC = () => {
  const { add } = useToast();
  const { t } = useTranslation('validation');
  const [view, setView] = useState('log-in');
  const handleError = (e: Auth0Error | null) => {
    if (e) {
      const [i18n, key] = getErrorMessage(e);

      add({
        colour: 'danger',
        message: i18n ? t(`${view}.${key}`) : key,
      });
    }
  };

  if (view === 'sign-up') {
    return <SignUp handleError={handleError} setView={setView} />;
  }

  return <LogIn handleError={handleError} setView={setView} />;
};

export default memo(Index);
