import { useToast } from '@motech-development/breeze-ui';
import React, { FC, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ForgottenPasswordForm, {
  FormSchema,
} from '../../components/ForgottenPasswordForm';
import useAuth from '../../hooks/auth';

export interface IForgottenPasswordProps {
  setView(view: string): void;
}

const ForgottenPassword: FC<IForgottenPasswordProps> = ({ setView }) => {
  const client = useAuth();
  const { add } = useToast();
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
        () => {
          setLoading(false);

          setView('log-in');

          add({
            colour: 'primary',
            message: t('success'),
          });
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
