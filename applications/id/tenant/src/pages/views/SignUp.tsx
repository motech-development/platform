import { Auth0Error } from 'auth0-js';
import React, { FC, memo, useState } from 'react';
import AuthForm, { FormSchema } from '../../components/AuthForm';
import useAuth from '../../hooks/auth';

export interface ISignUpProps {
  handleError(e: Auth0Error | null): void;
  setView(view: string): void;
}

const SignUp: FC<ISignUpProps> = ({ handleError, setView }) => {
  const client = useAuth();
  const [loading, setLoading] = useState(false);
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
      change="Go back"
      helpText="By signing up, you agree to our terms of service and privacy policy."
      submit="Sign up"
      onChange={() => setView('logIn')}
      onSubmit={signUp}
    />
  );
};

export default memo(SignUp);
