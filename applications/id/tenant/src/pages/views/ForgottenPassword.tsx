// TODO: Error handling messages
import { Auth0Error } from 'auth0-js';
import React, { FC, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ForgottenPasswordForm, {
  FormSchema,
} from '../../components/ForgottenPasswordForm';
import useAuth from '../../hooks/auth';

export interface IForgottenPasswordProps {
  handleError(e: Auth0Error | null): void;
  setView(view: string): void;
}

const ForgottenPassword: FC<IForgottenPasswordProps> = ({
  handleError,
  setView,
}) => {
  const client = useAuth();
  const { t } = useTranslation('forgotten-password');
  const [loading, setLoading] = useState(false);
  const sendEmail = ({ email }: FormSchema) => {
    if (client) {
      setLoading(true);

      client.changePassword(
        {
          connection: 'Username-Password-Authentication',
          email,
        },
        e => {
          handleError(e);

          setLoading(false);
        },
      );
    }
  };

  return (
    <ForgottenPasswordForm
      loading={loading}
      change={t('go-back')}
      helpText={t('help-text')}
      submit={t('send-email')}
      onChange={() => setView('log-in')}
      onSubmit={sendEmail}
    />
  );
};

export default memo(ForgottenPassword);
