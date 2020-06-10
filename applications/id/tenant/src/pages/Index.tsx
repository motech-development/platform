// TODO: Titles for views
// TODO: Reset password form
import { useToast } from '@motech-development/breeze-ui';
import { Auth0Error } from 'auth0-js';
import React, { FC, lazy, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import getErrorMessage from '../utils/getErrorMessage';

const LogIn = lazy(() => import('./views/LogIn'));
const SignUp = lazy(() => import('./views/SignUp'));

const Index: FC = () => {
  const { add } = useToast();
  const { t } = useTranslation('validation');
  const [view, setView] = useState('log-in');
  const handleError = (e: Auth0Error | null) => {
    if (e) {
      const [useI18n, key] = getErrorMessage(e);

      add({
        colour: 'danger',
        message: useI18n ? t(`${view}.${key}`) : key,
      });
    }
  };

  if (view === 'sign-up') {
    return <SignUp handleError={handleError} setView={setView} />;
  }

  return <LogIn handleError={handleError} setView={setView} />;
};

export default memo(Index);
