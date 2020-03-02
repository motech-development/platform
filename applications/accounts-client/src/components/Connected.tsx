import { Loader } from '@motech-development/breeze-ui';
import { ApolloError } from 'apollo-boost';
import React, { FC, memo, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorCard from './ErrorCard';

export interface IConnectProps {
  children: ReactNode;
  error?: ApolloError;
  loading: boolean;
}

const Connect: FC<IConnectProps> = ({
  children,
  error = undefined,
  loading,
}) => {
  const { t } = useTranslation('connected');

  if (loading) {
    return <Loader />;
  }

  if (error) {
    const messages = error.graphQLErrors.map(({ message }) => message);

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

export default memo(Connect);
