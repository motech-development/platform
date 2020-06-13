import React, { FC, lazy, memo, useEffect, useState } from 'react';

const ResetPassword = lazy(() => import('./views/ResetPassword'));
const Success = lazy(() => import('./views/Success'));

const Reset: FC = () => {
  const [view, setView] = useState('reset');

  useEffect(() => {
    if (!window.passwordReset) {
      const script = document.createElement('script');
      const scriptText = document.createTextNode(`
        try {
          window.passwordReset = {
            csrfToken: '{{csrf_token}}',
            email: '{{email | escape}}',
            passwordPolicy: '{{password_policy}}',
            ticket: '{{ticket}}',
          };
        } catch (e) {}
      `);

      script.appendChild(scriptText);

      document.body.appendChild(script);
    }
  }, []);

  if (view === 'success') {
    return <Success />;
  }

  return <ResetPassword setView={setView} />;
};

export default memo(Reset);
