import { ApolloError } from '@apollo/client';
import { Loader } from '@motech-development/breeze-ui';
import React, { FC, memo, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorCard from './ErrorCard';

export interface IConnectedProps {
  children: ReactNode;
  error?: ApolloError;
  loading: boolean;
}

const Connected: FC<IConnectedProps> = ({
  children,
  error = undefined,
  loading,
}) => {
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

  return <>{children}</>;
};

export default memo(Connected);
