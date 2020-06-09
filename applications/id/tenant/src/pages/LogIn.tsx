import { useToast } from '@motech-development/breeze-ui';
import { Auth0Error } from 'auth0-js';
import React, { FC, memo, useState } from 'react';
import AppTitle from '../components/AppTitle';
import AuthForm, { FormSchema } from '../components/AuthForm';
import Window from '../components/Window';
import useAuth from '../hooks/auth';

const LogIn: FC = () => {
  const client = useAuth();
  const { add } = useToast();
  const [view, setView] = useState('logIn');
  const [loading, setLoading] = useState(false);
  const handleError = (e: Auth0Error | null) => {
    if (e) {
      add({
        colour: 'danger',
        message: e.description || 'Something has gone wrong',
      });
    }

    setLoading(false);
  };
  const logIn = (values: FormSchema) => {
    if (client) {
      setLoading(true);
      const { password, username } = values;

      client.login(
        {
          password,
          realm: 'Username-Password-Authentication',
          username,
        },
        handleError,
      );
    }
  };
  const signUp = (values: FormSchema) => {
    if (client) {
      setLoading(true);

      const { password, username: email } = values;

      client.redirect.signupAndLogin(
        {
          connection: 'Username-Password-Authentication',
          email,
          password,
        },
        handleError,
      );
    }
  };

  return (
    <Window>
      <AppTitle />

      {view === 'logIn' && (
        <AuthForm
          loading={loading}
          change="Sign up"
          submit="Log in"
          onChange={() => setView('signUp')}
          onSubmit={logIn}
        />
      )}

      {view === 'signUp' && (
        <AuthForm
          loading={loading}
          change="Go back"
          submit="Sign up"
          onChange={() => setView('logIn')}
          onSubmit={signUp}
        />
      )}
    </Window>
  );
};

export default memo(LogIn);
