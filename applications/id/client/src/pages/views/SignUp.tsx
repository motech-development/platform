import { useToast } from '@motech-development/breeze-ui';
import { Auth0Error, WebAuth } from 'auth0-js';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AuthForm, { FormSchema } from '../../components/AuthForm';

export interface ISignUpProps {
  client: WebAuth;
  handleError: (e: Auth0Error | null) => void;
  setView: (view: string) => void;
}

function SignUp({ client, handleError, setView }: ISignUpProps) {
  const { t } = useTranslation('sign-up');
  const [loading, setLoading] = useState(false);
  const { add } = useToast();
  const signUp = ({
    family_name: familyName,
    given_name: givenName,
    password,
    username: email,
  }: FormSchema) => {
    setLoading(true);

    client.signup(
      {
        connection: 'Username-Password-Authentication',
        email,
        family_name: familyName,
        given_name: givenName,
        name: `${givenName} ${familyName}`,
        password,
      },
      (e) => {
        handleError(e);

        setLoading(false);

        if (!e) {
          setView('log-in');

          add({
            colour: 'success',
            message: t('success'),
          });
        }
      },
    );
  };

  return (
    <AuthForm
      name
      loading={loading}
      change={t('go-back')}
      helpText={t('help-text')}
      submit={t('sign-up')}
      onChange={() => setView('log-in')}
      onSubmit={signUp}
    />
  );
}

export default SignUp;
