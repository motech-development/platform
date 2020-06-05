import { Loader } from '@motech-development/breeze-ui';
import React, { ComponentType, memo } from 'react';
import { useAuth } from './AuthProvider';

const withAuth = (Component: ComponentType) =>
  memo(() => {
    const { isLoading } = useAuth();

    if (isLoading) {
      return <Loader />;
    }

    return <Component />;
  });

export default withAuth;
