import { useAuth } from '@motech-development/auth';
import React, { FC, memo } from 'react';

const PublicPage: FC = () => {
  const { loginWithRedirect } = useAuth();
  const login = () =>
    loginWithRedirect({
      appState: {
        targetUrl: '/protected',
      },
    });

  return (
    <button type="button" onClick={login}>
      Log in
    </button>
  );
};

export default memo(PublicPage);
