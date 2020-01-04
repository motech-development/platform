import { useAuth } from '@motech-development/auth';
import { Button, Card, Typography } from '@motech-development/breeze-ui';
import React, { FC, memo } from 'react';

const Dashboard: FC = () => {
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

      <Button type="button" onClick={logOut}>
        Log out
      </Button>
    </Card>
  );
};

export default memo(Dashboard);
