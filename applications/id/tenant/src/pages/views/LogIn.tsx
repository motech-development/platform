import { ButtonLink } from '@motech-development/breeze-ui';
import { Auth0Error } from 'auth0-js';
import React, { FC, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AuthForm, { FormSchema } from '../../components/AuthForm';
import useAuth from '../../hooks/auth';

export interface ILogInProps {
  handleError(e: Auth0Error | null): void;
  setView(view: string): void;
}

const LogIn: FC<ILogInProps> = ({ handleError, setView }) => {
  const client = useAuth();
  const { t } = useTranslation('log-in');
  const [loading, setLoading] = useState(false);
  const logIn = ({ password, username }: FormSchema) => {
    if (client) {
      setLoading(true);

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
      change={t('sign-up')}
      helpText={
        <ButtonLink type="button" onClick={() => setView('forgotten-password')}>
          {t('forgotten-password')}
        </ButtonLink>
      }
      submit={t('log-in')}
      onChange={() => setView('sign-up')}
      onSubmit={logIn}
    />
  );
};

export default memo(LogIn);
