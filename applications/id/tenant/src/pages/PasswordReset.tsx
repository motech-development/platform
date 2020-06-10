import React, { FC, memo, useEffect } from 'react';

const PasswordReset: FC = () => {
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

  return <div>Hello world</div>;
};

export default memo(PasswordReset);
