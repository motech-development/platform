import { Auth0Error } from 'auth0-js';
import React, { FC, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AuthForm, { FormSchema } from '../../components/AuthForm';
import useAuth from '../../hooks/useAuth';

export interface ISignUpProps {
  handleError(e: Auth0Error | null): void;
  setView(view: string): void;
}

const SignUp: FC<ISignUpProps> = ({ handleError, setView }) => {
  const client = useAuth();
  const { t } = useTranslation('sign-up');
  const [loading, setLoading] = useState(false);
  const signUp = ({ password, username: email }: FormSchema) => {
    if (client) {
      setLoading(true);

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
      change={t('go-back')}
      helpText={t('help-text')}
      submit={t('sign-up')}
      onChange={() => setView('log-in')}
      onSubmit={signUp}
    />
  );
};

export default memo(SignUp);
