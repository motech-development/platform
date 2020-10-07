import { Apollo } from '@motech-development/appsync-apollo';
import { useAuth } from '@motech-development/auth';
import { Loader } from '@motech-development/breeze-ui';
import React, { FC, memo, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Container from './Container';
import ErrorCard from './ErrorCard';

export interface IApolloClientProps {
  children: ReactNode;
}

const ApolloClient: FC<IApolloClientProps> = ({ children }) => {
  const { getTokenSilently, isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation('apollo-client');

  return (
    <Apollo
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
};

export default memo(ApolloClient);
