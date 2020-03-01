import { useAuth } from '@motech-development/auth';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { AuthOptions, createAuthLink } from 'aws-appsync-auth-link';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import React, { FC, memo, ReactElement, useEffect, useState } from 'react';
import { ApolloProvider } from 'react-apollo';

const { REACT_APP_APPSYNC_URL = '', REACT_APP_AWS_REGION = '' } = process.env;
const url = REACT_APP_APPSYNC_URL;
const region = REACT_APP_AWS_REGION;

export interface IApolloProps {
  children: ReactElement;
}

const Apollo: FC<IApolloProps> = ({ children }) => {
  const { getTokenSilently, isLoading } = useAuth();
  const [apolloClient, setApolloClient] = useState();

  useEffect(() => {
    if (!isLoading) {
      const auth: AuthOptions = {
        jwtToken: async () => {
          const token = await getTokenSilently();

          return token as string;
        },
        type: 'OPENID_CONNECT',
      };
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
      const client = new ApolloClient({
        cache: new InMemoryCache(),
        link,
      });

      setApolloClient(client);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return apolloClient ? (
    <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
  ) : null;
};

export default memo(Apollo);
