import { Reference } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { Apollo } from '@motech-development/appsync-apollo';
import { Loader } from '@motech-development/breeze-ui';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { StrictTypedTypePolicies } from '../graphql/graphql';
import Container from './Container';
import ErrorCard from './ErrorCard';

export interface IApolloClientProps {
  children: ReactNode;
}

function filterRefs(incoming: Reference[], existing: Reference[] = []) {
  return [...existing, ...incoming].filter(
    ({ __ref }, index, self) =>
      // eslint-disable-next-line no-underscore-dangle
      index === self.findIndex((item) => item.__ref === __ref),
  );
}

export const typePolicies: StrictTypedTypePolicies = {
  Transactions: {
    fields: {
      items: {
        merge: (existing: Reference[] | undefined, incoming: Reference[]) =>
          filterRefs(incoming, existing),
      },
    },
    keyFields: ['id', 'status'],
  },
};

function ApolloClient({ children }: IApolloClientProps) {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const { t } = useTranslation('apollo-client');

  return (
    <Apollo
      cacheConfig={{
        typePolicies,
      }}
      error={
        <Container>
          <ErrorCard
            title={t('error.title')}
            description={t('error.description')}
          />
        </Container>
      }
      fallback={<Loader />}
      getTokenSilently={getAccessTokenSilently}
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      unauthorised={
        <Container>
          <ErrorCard
            title={t('unauthorised.title')}
            description={t('unauthorised.description')}
          />
        </Container>
      }
    >
      {children}
    </Apollo>
  );
}

export default ApolloClient;
