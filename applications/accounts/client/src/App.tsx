import { useAuth0 } from '@auth0/auth0-react';
import { WithAuth } from '@motech-development/auth';
import { Loader, useToast } from '@motech-development/breeze-ui';
import { Suspense, useEffect } from 'react';
import { pageview, set } from 'react-ga';
import { useIdleTimer } from 'react-idle-timer';
import { useLocation } from 'react-router-dom';
import Pages from './pages';
import isProd from './utils/isProd';

function App() {
  const { isAuthenticated, logout } = useAuth0();
  const { add } = useToast();
  const timeout = isProd(600000, 3600000);
  const location = useLocation();
  const logOut = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    }).catch(() => {});
  };
  const onIdle = () => {
    if (isAuthenticated) {
      logOut();
    }
  };
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
    set({
      page: location.pathname,
    });
    pageview(location.pathname);
  }, [location]);

  useIdleTimer({
    onIdle,
    timeout,
  });

  return (
    <WithAuth fallback={<Loader />} onError={onError}>
      <Suspense fallback={<Loader />}>
        <Pages />
      </Suspense>
    </WithAuth>
  );
}

export default App;
