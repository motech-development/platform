import { useAuth, WithAuth } from '@motech-development/auth';
import { Loader, useToast } from '@motech-development/breeze-ui';
import React, { FC, memo, Suspense, useEffect } from 'react';
import { pageview } from 'react-ga';
import IdleTimer from 'react-idle-timer';
import { useLocation } from 'react-router-dom';
import Pages from './pages';

const App: FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { add } = useToast();
  const timeout = process.env.NODE_ENV === 'production' ? 600000 : 3600000;
  const location = useLocation();
  const logOut = () =>
    logout({
      returnTo: window.location.origin,
    });
  const onError = (message: string) => {
    add({
      colour: 'danger',
      message,
      onDismiss: () => {
        logOut();
      },
    });
  };

  useEffect(() => {
    pageview(location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WithAuth fallback={<Loader />} onError={onError}>
      <Suspense fallback={<Loader />}>
        {isAuthenticated && <IdleTimer onIdle={logOut} timeout={timeout} />}

        <Pages />
      </Suspense>
    </WithAuth>
  );
};

export default memo(App);
