import { useAuth } from '@motech-development/auth';
import React, { FC, memo } from 'react';

const ProtectedPage: FC = () => {
  const { logout, user } = useAuth();
  const logOut = () =>
    logout({
      returnTo: window.location.origin,
    });

  return (
    <>
      {user && <p>Hello {user.name}</p>}

      <button type="button" onClick={logOut}>
        Log out
      </button>
    </>
  );
};

export default memo(ProtectedPage);
