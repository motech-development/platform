import { Auth0Error, WebAuth } from 'auth0-js';
import React, { FC, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AuthForm, { FormSchema } from '../../components/AuthForm';

export interface ISignUpProps {
  client: WebAuth;
  handleError(e: Auth0Error | null): void;
  setView(view: string): void;
}

const SignUp: FC<ISignUpProps> = ({ client, handleError, setView }) => {
  const { t } = useTranslation('sign-up');
  const [loading, setLoading] = useState(false);
  const signUp = ({ password, username: email }: FormSchema) => {
    setLoading(true);

    client.signupAndAuthorize(
      {
        connection: 'Username-Password-Authentication',
        email,
        password,
        userMetadata: {
          family_name: 'Gusbi',
          given_name: 'Mo',
        },
      },
      e => {
        handleError(e);

        setLoading(false);
      },
    );
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
