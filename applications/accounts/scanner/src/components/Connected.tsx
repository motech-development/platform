import { IonLoading } from '@ionic/react';
import { ApolloError } from 'apollo-boost';
import React, { FC, memo, ReactNode } from 'react';
import ErrorCard from './ErrorCard';

export interface IConnectedProps {
  children: ReactNode;
  error?: ApolloError;
  loading: boolean;
}

const Connected: FC<IConnectedProps> = ({ children, error, loading }) => {
  if (loading) {
    return <IonLoading isOpen data-testid="connected-loading" />;
  }

  if (error) {
    return <ErrorCard description={error.name} />;
  }

  return <>{children}</>;
};

export default memo(Connected);
