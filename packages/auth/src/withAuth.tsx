import { Loader } from '@motech-development/breeze-ui';
import React, { ComponentType } from 'react';
import { useAuth } from './AuthProvider';

const withAuth = (Component: ComponentType) => () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  return <Component />;
};

export default withAuth;
