import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { createAuthLink } from 'aws-appsync-auth-link';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import React, { FC, ReactNode, useEffect, useState } from 'react';

export interface IApolloProps {
  children: ReactNode;
  error: ReactNode;
  fallback: ReactNode;
  isAuthenticated: boolean;
  isLoading: boolean;
  unauthorised: ReactNode;
  getTokenSilently(): Promise<string | undefined>;
}

const Apollo: FC<IApolloProps> = ({
  children,
  error,
  fallback,
  getTokenSilently,
  isAuthenticated,
  isLoading,
  unauthorised,
}) => {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();
  const { REACT_APP_APPSYNC_URL, REACT_APP_AWS_REGION } = process.env;
  const url = REACT_APP_APPSYNC_URL;
  const region = REACT_APP_AWS_REGION;

  useEffect(() => {
    if (url && region) {
      const auth = {
        jwtToken: async () => {
          const token = await getTokenSilently();

          return token as string;
        },
        type: 'OPENID_CONNECT' as const,
      };
      const cache = new InMemoryCache();
      const link = ApolloLink.from([
        createAuthLink({
          auth,
          region,
          url,
        }),
        createSubscriptionHandshakeLink({
          auth,
          region,
          url,
        }),
      ]);
      const apollo = new ApolloClient({
        cache,
        link,
      });

      setClient(apollo);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!url || !region) {
    return <>{error}</>;
  }

  if (isLoading || !client) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    return <>{unauthorised}</>;
  }

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default Apollo;
