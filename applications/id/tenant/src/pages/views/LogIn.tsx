import { Auth0Error } from 'auth0-js';
import React, { FC, memo, useState } from 'react';
import AuthForm, { FormSchema } from '../../components/AuthForm';
import useAuth from '../../hooks/auth';

export interface ILogInProps {
  handleError(e: Auth0Error | null): void;
  setView(view: string): void;
}

const LogIn: FC<ILogInProps> = ({ handleError, setView }) => {
  const client = useAuth();
  const [loading, setLoading] = useState(false);
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
        e => {
          handleError(e);

          setLoading(false);
        },
      );
    }
  };

  return (
    <AuthForm
      loading={loading}
      change="Sign up"
      submit="Log in"
      onChange={() => setView('signUp')}
      onSubmit={logIn}
    />
  );
};

export default memo(LogIn);
