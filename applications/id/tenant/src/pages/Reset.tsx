import React, { FC, memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResetPasswordForm, { FormSchema } from '../components/ResetPasswordForm';

const Reset: FC = () => {
  const [loading] = useState(false);
  const { t } = useTranslation('reset');
  const resetPassword = (values: FormSchema) => {
    // eslint-disable-next-line no-console
    console.log(values);
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
