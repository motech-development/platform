import {
  Inline,
  Logo,
  Spinner,
  Stack,
  Typography,
} from '@motech-development/breeze-ui';
import { useRouterState } from '@tanstack/react-router';
import { type ReactNode, useEffect, useState } from 'react';
import type { RouterAuthentication } from './router';

export function AuthenticationTransition({
  label,
}: Readonly<{ label: string }>) {
  return (
    <main className="grid min-h-dvh place-items-center bg-[var(--breeze-shell)] px-6 py-16 text-[var(--breeze-surface)]">
      <Stack align="center" gap="xl">
        <Inline gap="sm" justify="center" wrap={false}>
          <Logo size="lg" />
          <Typography as="strong" colour="inverse" level="h3">
            Accounts
          </Typography>
        </Inline>
        <Spinner label={label} size="lg" variant="light" />
      </Stack>
    </main>
  );
}

export function AuthenticationLoading({
  authentication,
  children,
}: Readonly<{
  authentication: RouterAuthentication;
  children: ReactNode;
}>) {
  const routeLoading = useRouterState({
    select: ({ isLoading }) => isLoading,
  });
  const [authenticationSettled, setAuthenticationSettled] = useState(false);
  const redirectPending = authentication.isRedirectPending();
  const ready = authenticationSettled && !routeLoading && !redirectPending;
  const [initialLoadComplete, setInitialLoadComplete] = useState(ready);

  useEffect(() => {
    let active = true;

    authentication
      .waitUntilSettled()
      .then(() => {
        if (active) {
          setAuthenticationSettled(true);
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [authentication]);

  useEffect(() => {
    if (ready) {
      setInitialLoadComplete(true);
    }
  }, [ready]);

  if (!redirectPending && (initialLoadComplete || ready)) {
    return children;
  }

  return <AuthenticationTransition label="Loading Accounts" />;
}
