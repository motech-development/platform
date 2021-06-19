import { useToast } from '@motech-development/breeze-ui';
import { WebAuth } from 'auth0-js';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ForgottenPasswordForm, {
  FormSchema,
} from '../../components/ForgottenPasswordForm';

export interface IForgottenPasswordProps {
  client: WebAuth;
  setView(view: string): void;
}

const ForgottenPassword: FC<IForgottenPasswordProps> = ({
  client,
  setView,
}) => {
  const { add } = useToast();
  const { t } = useTranslation('forgotten-password');
  const [loading, setLoading] = useState(false);
  const sendEmail = ({ email }: FormSchema) => {
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
          colour: 'success',
          message: t('success'),
        });
      },
    );
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

export default ForgottenPassword;
