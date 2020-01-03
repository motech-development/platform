import { useAuth } from '@motech-development/auth';
import { Button, Card } from '@motech-development/breeze-ui';
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
    <Card>
      <Button type="button" onClick={login}>
        Log in
      </Button>
    </Card>
  );
};

export default memo(PublicPage);
