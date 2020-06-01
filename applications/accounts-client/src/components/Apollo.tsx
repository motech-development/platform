import { ApolloProvider } from '@apollo/react-hooks';
import { useAuth } from '@motech-development/auth';
import { Loader } from '@motech-development/breeze-ui';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { createAuthLink } from 'aws-appsync-auth-link';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import React, { FC, memo, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorCard from './ErrorCard';

export interface IApolloProps {
  children: ReactNode;
}

const Apollo: FC<IApolloProps> = ({ children }) => {
  const { getTokenSilently, isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation('apollo');
  const { REACT_APP_APPSYNC_URL, REACT_APP_AWS_REGION } = process.env;
  const url = REACT_APP_APPSYNC_URL;
  const region = REACT_APP_AWS_REGION;

  if (!url || !region) {
    return (
      <ErrorCard
        title={t('error.title')}
        description={t('error.description')}
      />
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return (
      <ErrorCard
        title={t('unauthorised.title')}
        description={t('unauthorised.description')}
      />
    );
  }

  const auth = {
    jwtToken: async () => {
      const token = (await getTokenSilently()) as string;

      return token;
    },
    type: 'OPENID_CONNECT' as const,
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

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default memo(Apollo);
