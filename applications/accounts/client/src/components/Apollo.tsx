import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { useAuth } from '@motech-development/auth';
import { Loader } from '@motech-development/breeze-ui';
import { createAuthLink } from 'aws-appsync-auth-link';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import React, { FC, memo, ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Container from './Container';
import ErrorCard from './ErrorCard';

export interface IApolloProps {
  children: ReactNode;
}

const Apollo: FC<IApolloProps> = ({ children }) => {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();
  const { getTokenSilently, isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation('apollo');
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
    return (
      <Container>
        <ErrorCard
          title={t('error.title')}
          description={t('error.description')}
        />
      </Container>
    );
  }

  if (isLoading || !client) {
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

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default memo(Apollo);
