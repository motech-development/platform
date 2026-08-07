import { useApolloClient } from '@apollo/client/react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, StatePanel } from '@motech-development/breeze-ui';
import { useLocation } from '@tanstack/react-router';
import { type ReactNode, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  captureSessionRenewalFailure,
  setObservabilityUser,
} from '../observability';
import { AuthenticationPanel } from './AuthenticationPanel';
import {
  type AccountsOwnerId,
  accountsOwnerIdFromAuth0User,
  AccountsOwnerProvider,
} from './owner';
import { requiresInteractiveAuthentication } from './redirect';
import {
  beginAccessTokenRenewal,
  completeAccessTokenRenewal,
  setAccessTokenProvider,
} from './token';

export interface AuthBoundaryProps {
  children: ReactNode;
  pending: ReactNode;
  preparedOwner?: AccountsOwnerId;
  renderProtected: (
    content: ReactNode,
    authenticatedOwner?: AccountsOwnerId,
  ) => ReactNode;
}

export function AuthBoundary({
  children,
  pending,
  preparedOwner,
  renderProtected,
}: Readonly<AuthBoundaryProps>) {
  const { t } = useTranslation('authentication');
  const apolloClient = useApolloClient();
  const auth = useAuth0();
  const {
    error,
    getAccessTokenSilently,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    user,
  } = auth;
  const ownerId = accountsOwnerIdFromAuth0User(user);
  const authenticatedOwner =
    isAuthenticated && ownerId === preparedOwner ? preparedOwner : undefined;
  const observabilityOwnerId = authenticatedOwner;
  const verifiedEmail =
    observabilityOwnerId && user?.email_verified ? user.email : undefined;
  const location = useLocation();
  const [sessionError, setSessionError] = useState<Error>();
  const returnTo = location.href;
  const interactiveAuthenticationRequired =
    requiresInteractiveAuthentication(error);
  const resetIdentityOwnedState = useCallback(async () => {
    setAccessTokenProvider(undefined);
    await apolloClient.clearStore();
  }, [apolloClient]);

  useEffect(() => {
    setObservabilityUser(observabilityOwnerId, verifiedEmail);

    return () => {
      setObservabilityUser();
    };
  }, [observabilityOwnerId, verifiedEmail]);

  useEffect(() => {
    if (!isAuthenticated) {
      return undefined;
    }

    const disconnect = () => {
      beginAccessTokenRenewal();
    };
    const reconnect = async () => {
      beginAccessTokenRenewal();

      try {
        await getAccessTokenSilently({ cacheMode: 'off' });
        completeAccessTokenRenewal();
        await apolloClient.refetchQueries({ include: 'active' });
        setSessionError(undefined);
      } catch (cause: unknown) {
        completeAccessTokenRenewal();
        const failure =
          cause instanceof Error
            ? cause
            : new Error('Session renewal failed', { cause });

        captureSessionRenewalFailure(failure);
        await resetIdentityOwnedState().catch(() => undefined);
        setSessionError(failure);
      }
    };
    const onReconnect = () => {
      reconnect().catch(() => undefined);
    };

    if (!navigator.onLine) {
      disconnect();
    }

    window.addEventListener('offline', disconnect);
    window.addEventListener('online', onReconnect);

    return () => {
      window.removeEventListener('offline', disconnect);
      window.removeEventListener('online', onReconnect);
      completeAccessTokenRenewal();
    };
  }, [
    apolloClient,
    getAccessTokenSilently,
    isAuthenticated,
    resetIdentityOwnedState,
  ]);

  useEffect(() => {
    if (!error || interactiveAuthenticationRequired || !ownerId) {
      return;
    }

    resetIdentityOwnedState().catch(() => undefined);
  }, [
    error,
    interactiveAuthenticationRequired,
    ownerId,
    resetIdentityOwnedState,
  ]);

  if ((error && !interactiveAuthenticationRequired) || sessionError) {
    return renderProtected(
      <StatePanel
        action={
          <Button
            onAction={() => {
              loginWithRedirect().catch(() => undefined);
            }}
          >
            {t('Try signing in again')}
          </Button>
        }
        description={t(
          'Your session could not be established. No account data has been loaded.',
        )}
        icon={<span aria-hidden="true">!</span>}
        title={t('Sign-in failed')}
        variant="danger"
      />,
      undefined,
    );
  }

  if (interactiveAuthenticationRequired) {
    return (
      <AuthenticationPanel
        onSignIn={() => {
          loginWithRedirect({
            appState: { returnTo },
          }).catch(() => undefined);
        }}
      />
    );
  }

  if (isLoading || !authenticatedOwner) {
    return renderProtected(pending, authenticatedOwner);
  }

  return renderProtected(
    <AccountsOwnerProvider ownerId={authenticatedOwner}>
      <div key={authenticatedOwner}>{children}</div>
    </AccountsOwnerProvider>,
    authenticatedOwner,
  );
}
