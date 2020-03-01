import { Loader } from '@motech-development/breeze-ui';
import { ApolloError } from 'apollo-boost';
import React, { FC, memo, ReactNode } from 'react';

export interface IConnectProps {
  children: ReactNode;
  error: ApolloError | undefined;
  loading: boolean;
}

// TODO: Handle errors
const Connect: FC<IConnectProps> = ({ children, loading }) => {
  if (loading) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default memo(Connect);
