import { useAuth0 } from '@auth0/auth0-react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { AuthenticationPanel } from '../auth/AuthenticationPanel';
import { isAuthCallback, returnToFromAuthError } from '../auth/redirect';

function WelcomePage() {
  const auth = useAuth0();
  const navigate = useNavigate();
  const [authCallback] = useState(
    () =>
      typeof window !== 'undefined' && isAuthCallback(window.location.search),
  );
  const errorReturnTo =
    typeof window === 'undefined'
      ? undefined
      : returnToFromAuthError(auth.error, window.location.origin);

  useEffect(() => {
    if (auth.isAuthenticated && !authCallback) {
      navigate({ replace: true, to: '/my-companies' }).catch(() => undefined);
    } else if (errorReturnTo) {
      navigate({ href: errorReturnTo, replace: true }).catch(() => undefined);
    }
  }, [auth.isAuthenticated, authCallback, errorReturnTo, navigate]);

  return (
    <AuthenticationPanel
      loading={auth.isLoading}
      onSignIn={() => {
        auth
          .loginWithRedirect({
            appState: { returnTo: '/my-companies' },
          })
          .catch(() => undefined);
      }}
    />
  );
}

export const Route = createFileRoute('/')({
  component: WelcomePage,
});
