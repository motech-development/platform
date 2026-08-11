import { ApolloLink } from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';
import { RemoveTypenameFromVariablesLink } from '@apollo/client/link/remove-typename';
import { LocalState } from '@apollo/client/local-state';
import { ApolloClient } from '@apollo/client-integration-tanstack-start';
import { AUTH_TYPE, createAuthLink } from 'aws-appsync-auth-link';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import { Buffer } from 'buffer';
import { getAccessToken } from '../auth/token';
import type { AccountsWebConfig } from '../config';
import { captureGraphqlFailure } from '../observability';
import { createAccountsCache } from './cache';

if (typeof window !== 'undefined') {
  globalThis.Buffer = Buffer;
}

export function createAccountsApolloClient(config: AccountsWebConfig) {
  const auth = {
    jwtToken: getAccessToken,
    type: AUTH_TYPE.OPENID_CONNECT,
  } as const;
  const authLink = createAuthLink({
    auth,
    region: config.region,
    url: config.appsyncUrl,
  }) as unknown as ApolloLink;
  const subscriptionLink = createSubscriptionHandshakeLink({
    auth,
    region: config.region,
    url: config.appsyncUrl,
  });
  const errorLink = new ErrorLink(({ error, operation, result }) => {
    captureGraphqlFailure({
      error,
      operationName: operation.operationName ?? 'anonymous',
      result,
      variables: operation.variables,
    });
  });

  return new ApolloClient({
    cache: createAccountsCache(),
    link: ApolloLink.from([
      new RemoveTypenameFromVariablesLink(),
      errorLink,
      authLink,
      subscriptionLink,
    ]),
    localState: new LocalState(),
  });
}

export { routerWithApolloClient } from '@apollo/client-integration-tanstack-start';
