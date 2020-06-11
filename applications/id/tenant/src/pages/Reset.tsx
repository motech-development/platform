import { usePost } from '@motech-development/axios-hooks';
import React, { FC, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ResetPasswordForm, { FormSchema } from '../components/ResetPasswordForm';

const Reset: FC = () => {
  const { t } = useTranslation('reset');
  const [reset, { loading }] = usePost({
    onCompleted: res => {
      // eslint-disable-next-line no-console
      console.log(res);
    },
    onError: err => {
      // eslint-disable-next-line no-console
      console.log(err);
    },
  });
  const resetPassword = async ({ confirmPassword, ...rest }: FormSchema) => {
    await reset('/lo/reset', rest);
  };

  useEffect(() => {
    if (!window.passwordReset) {
      const script = document.createElement('script');
      const scriptText = document.createTextNode(`
        try {
          window.passwordReset = {
            csrfToken: '{{csrf_token}}',
            email: '{{email | escape}}',
            passwordComplexityOptions: '{{password_complexity_options}}',
            passwordPolicy: '{{password_policy}}',
            ticket: '{{ticket}}',
          };
        } catch (e) {}
      `);

      script.appendChild(scriptText);

      document.body.appendChild(script);
    }
  }, []);

  return (
    <ResetPasswordForm
      loading={loading}
      submit={t('reset-password')}
      onSubmit={resetPassword}
    />
  );
};

export default memo(Reset);
