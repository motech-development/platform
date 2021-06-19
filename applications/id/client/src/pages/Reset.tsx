import { Loader, Window } from '@motech-development/breeze-ui';
import { FC, lazy, useEffect, useState } from 'react';
import { pageview } from 'react-ga';
import AppTitle from '../components/AppTitle';

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

  useEffect(() => {
    pageview(view);
  }, [view]);

  return (
    <>
      {window.passwordReset ? (
        <Window>
          <AppTitle />

          {view === 'success' && <Success />}

          {view === 'reset' && <ResetPassword setView={setView} />}
        </Window>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Reset;
