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
import Container from './Container';
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
      <Container>
        <ErrorCard
          title={t('error.title')}
          description={t('error.description')}
        />
      </Container>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return (
      <Container>
        <ErrorCard
          title={t('unauthorised.title')}
          description={t('unauthorised.description')}
        />
      </Container>
    );
  }

  const auth = {
    jwtToken: async () => {
      const token = await getTokenSilently();

      return token as string;
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
