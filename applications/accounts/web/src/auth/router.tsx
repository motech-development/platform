import type { ApolloClientIntegration } from '@apollo/client-integration-tanstack-start';
import {
  type AppState,
  type Auth0ContextInterface,
  Auth0Provider,
  useAuth0,
} from '@auth0/auth0-react';
import type { AnyRouter } from '@tanstack/react-router';
import { type ReactNode, useEffect } from 'react';
import type { AccountsWebConfig } from '../config';
import { type AccountsOwnerId, accountsOwnerIdFromAuth0User } from './owner';
import { setAccessTokenProvider } from './token';

export interface RouterAuthenticationSnapshot {
  error?: Error;
  isAuthenticated: boolean;
  loginWithRedirect: Auth0ContextInterface['loginWithRedirect'];
  ownerId?: AccountsOwnerId;
  preparationError?: Error;
}

export interface RouterAuthentication {
  isRedirectPending(): boolean;
  waitUntilReady(): Promise<RouterAuthenticationSnapshot>;
  waitUntilSettled(): Promise<void>;
}

export type AccountsRouterContext = ApolloClientIntegration.RouterContext & {
  authentication: RouterAuthentication;
};

export type AuthenticatedAccountsRouterContext = AccountsRouterContext & {
  authenticatedOwner?: AccountsOwnerId;
};

interface RouterAuthenticationController extends RouterAuthentication {
  markRedirectPending(): void;
  publish(snapshot: RouterAuthenticationSnapshot): boolean;
  settle(): void;
}

export function createRouterAuthentication(): RouterAuthenticationController {
  let current: RouterAuthenticationSnapshot | undefined;
  let redirectPending = false;
  let settled = false;
  let settlementWaiting: Array<() => void> = [];
  let waiting: Array<(snapshot: RouterAuthenticationSnapshot) => void> = [];

  return {
    isRedirectPending() {
      return redirectPending;
    },
    markRedirectPending() {
      redirectPending = true;
    },
    publish(snapshot) {
      const wasReady = Boolean(current);

      current = snapshot;
      waiting.forEach((resolve) => {
        resolve(snapshot);
      });
      waiting = [];

      return wasReady;
    },
    settle() {
      if (settled) {
        return;
      }

      settled = true;
      settlementWaiting.forEach((resolve) => {
        resolve();
      });
      settlementWaiting = [];
    },
    waitUntilReady() {
      if (current) {
        return Promise.resolve(current);
      }

      return new Promise((resolve) => {
        waiting.push(resolve);
      });
    },
    waitUntilSettled() {
      if (settled) {
        return Promise.resolve();
      }

      return new Promise((resolve) => {
        settlementWaiting.push(resolve);
      });
    },
  };
}

interface AuthenticationProviderOptions {
  apolloClient: ApolloClientIntegration.RouterContext['apolloClient'];
  authentication: RouterAuthenticationController;
  config: AccountsWebConfig;
  router: AnyRouter;
}

export function createAccountsAuthenticationProvider({
  apolloClient,
  authentication,
  config,
  router,
}: AuthenticationProviderOptions) {
  let identityUpdate = Promise.resolve();
  let preparedOwner: AccountsOwnerId | undefined;
  let redirectDestination: string | undefined;

  function AuthenticationBridge() {
    const auth = useAuth0();
    const authLoginWithRedirect = auth.loginWithRedirect;
    const ownerId = accountsOwnerIdFromAuth0User(auth.user);

    useEffect(() => {
      if (auth.isLoading) {
        return;
      }

      const nextOwner = auth.isAuthenticated ? ownerId : undefined;
      const loginWithRedirect: Auth0ContextInterface['loginWithRedirect'] =
        async (options) => {
          await authLoginWithRedirect(options);
          authentication.markRedirectPending();
        };

      identityUpdate = identityUpdate.then(async () => {
        setAccessTokenProvider(
          nextOwner ? auth.getAccessTokenSilently : undefined,
        );

        try {
          if (preparedOwner !== nextOwner) {
            await apolloClient.clearStore();
            preparedOwner = nextOwner;
          }

          const shouldInvalidate = authentication.publish({
            error: auth.error,
            isAuthenticated: auth.isAuthenticated,
            loginWithRedirect,
            ownerId: nextOwner,
          });

          if (redirectDestination) {
            const href = redirectDestination;

            redirectDestination = undefined;
            await router.navigate({ href, replace: true });
          } else if (shouldInvalidate) {
            await router.invalidate();
          }
        } catch (cause: unknown) {
          const failure =
            cause instanceof Error ? cause : new Error('Identity setup failed');

          const shouldInvalidate = authentication.publish({
            error: auth.error,
            isAuthenticated: auth.isAuthenticated,
            loginWithRedirect,
            preparationError: failure,
          });

          if (shouldInvalidate) {
            await router.invalidate();
          }
        } finally {
          authentication.settle();
        }
      });
    }, [
      auth.error,
      auth.getAccessTokenSilently,
      auth.isAuthenticated,
      auth.isLoading,
      authLoginWithRedirect,
      ownerId,
    ]);

    useEffect(
      () => () => {
        setAccessTokenProvider(undefined);
      },
      [],
    );

    return null;
  }

  function AccountsAuthenticationProvider({
    children,
  }: Readonly<{ children: ReactNode }>) {
    const onRedirectCallback = (appState?: AppState) => {
      redirectDestination = appState?.returnTo || '/my-companies';
    };

    return (
      <Auth0Provider
        authorizationParams={{
          audience: config.auth0Audience,
          redirect_uri:
            typeof window === 'undefined' ? undefined : window.location.origin,
        }}
        cacheLocation="memory"
        clientId={config.auth0ClientId}
        domain={config.auth0Domain}
        onRedirectCallback={onRedirectCallback}
        useRefreshTokens
        useRefreshTokensFallback
      >
        <AuthenticationBridge />
        {children}
      </Auth0Provider>
    );
  }

  return AccountsAuthenticationProvider;
}
