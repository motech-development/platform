import { Reference, StoreObject } from '@apollo/client';
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
  Mutation: {
    fields: {
      deleteTransaction: {
        // Ensure we can act on the returned entity by evicting it from the cache.
        // This centralizes deletion behavior so components don't need update functions.
        merge: (
          existing: StoreObject | null,
          incoming: StoreObject | null,
          { cache },
        ) => {
          const id = incoming ? cache.identify(incoming) : undefined;

          if (id) {
            cache.evict({ id });
            cache.gc();
          }

          // Return the server result so callers still receive data
          return incoming ?? existing ?? null;
        },
      },
    },
  },
  Transactions: {
    fields: {
      items: {
        // Merge incoming items with existing while deduping
        merge: (existing: Reference[] | undefined, incoming: Reference[]) =>
          filterRefs(incoming, existing),
        // Filter out dangling references on read, so evicted items disappear from lists
        read: (existing: Reference[] | undefined, { canRead }) => {
          const list = existing ?? [];
          return list.filter((ref) => canRead(ref));
        },
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
