import { useToast } from '@motech-development/breeze-ui';
import { Auth0Error } from 'auth0-js';
import React, { FC, lazy, memo, useState } from 'react';

const LogIn = lazy(() => import('./views/LogIn'));
const SignUp = lazy(() => import('./views/SignUp'));

const Index: FC = () => {
  const { add } = useToast();
  const [view, setView] = useState('logIn');
  const handleError = (e: Auth0Error | null) => {
    if (e) {
      add({
        colour: 'danger',
        message: e.description || 'Something has gone wrong',
      });
    }
  };

  if (view === 'signUp') {
    return <SignUp handleError={handleError} setView={setView} />;
  }

  return <LogIn handleError={handleError} setView={setView} />;
};

export default memo(Index);
