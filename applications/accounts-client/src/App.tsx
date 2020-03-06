import { useAuth, withAuth } from '@motech-development/auth';
import { Loader } from '@motech-development/breeze-ui';
import React, { FC, memo, Suspense } from 'react';
import IdleTimer from 'react-idle-timer';
import Pages from './pages';

const App: FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const timeout = process.env.NODE_ENV === 'production' ? 600000 : 3600000;
  const logOut = () =>
    logout({
      returnTo: window.location.origin,
    });

  return (
    <Suspense fallback={<Loader />}>
      {isAuthenticated && <IdleTimer onIdle={logOut} timeout={timeout} />}

      <Pages />
    </Suspense>
  );
};

export default memo(withAuth(App));
