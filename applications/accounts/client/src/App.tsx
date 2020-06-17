import { useAuth, withAuth } from '@motech-development/auth';
import { Loader } from '@motech-development/breeze-ui';
import React, { FC, memo, Suspense, useEffect } from 'react';
import { pageview } from 'react-ga';
import IdleTimer from 'react-idle-timer';
import { useLocation } from 'react-router-dom';
import Pages from './pages';

const App: FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const timeout = process.env.NODE_ENV === 'production' ? 600000 : 3600000;
  const location = useLocation();
  const logOut = () =>
    logout({
      returnTo: window.location.origin,
    });

  useEffect(() => {
    pageview(location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      {isAuthenticated && <IdleTimer onIdle={logOut} timeout={timeout} />}

      <Pages />
    </Suspense>
  );
};

export default memo(withAuth(App));
