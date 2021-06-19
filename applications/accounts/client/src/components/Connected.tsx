import { ApolloError } from '@apollo/client';
import { Loader } from '@motech-development/breeze-ui';
import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorCard from './ErrorCard';

export interface IConnectedProps {
  children: ReactNode;
  error?: ApolloError;
  loading: boolean;
}

const Connected: FC<IConnectedProps> = ({ children, error, loading }) => {
  const { t } = useTranslation('connected');

  if (loading) {
    return <Loader />;
  }

  if (error) {
    const messages =
      error.graphQLErrors && error.graphQLErrors.map(({ message }) => message);

    return (
      <ErrorCard
        title={error.name}
        description={t('description')}
        errors={messages}
      />
    );
  }

  return <div data-testid="connected-content">{children}</div>;
};

export default Connected;
