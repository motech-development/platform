import { Apollo } from '@motech-development/appsync-apollo';
import { useAuth } from '@motech-development/auth';
import { Loader } from '@motech-development/breeze-ui';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Container from './Container';
import ErrorCard from './ErrorCard';

export interface IApolloClientProps {
  children: ReactNode;
}

function ApolloClient({ children }: IApolloClientProps) {
  const { getTokenSilently, isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation('apollo-client');

  return (
    <Apollo
      cacheConfig={{
        typePolicies: {
          Transactions: {
            keyFields: ['id', 'status'],
          },
        },
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
      getTokenSilently={getTokenSilently}
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
