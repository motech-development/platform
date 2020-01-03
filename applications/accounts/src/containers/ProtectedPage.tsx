import { useAuth } from '@motech-development/auth';
import { Card, Typography } from '@motech-development/breeze-ui';
import React, { FC, memo } from 'react';

const ProtectedPage: FC = () => {
  const { logout, user } = useAuth();
  const logOut = () =>
    logout({
      returnTo: window.location.origin,
    });

  return (
    <Card>
      {user && (
        <Typography component="h1" variant="h2">
          Hello {user.name}
        </Typography>
      )}

      <button type="button" onClick={logOut}>
        Log out
      </button>
    </Card>
  );
};

export default memo(ProtectedPage);
