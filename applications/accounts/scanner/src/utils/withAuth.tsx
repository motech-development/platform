import { IonLoading } from '@ionic/react';
import { useAuth } from '@motech-development/auth';
import React, { ComponentType, memo } from 'react';
import Login from '../pages/Login';

const withAuth = (Component: ComponentType) =>
  memo(() => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return <IonLoading isOpen />;
    }

    if (isAuthenticated) {
      return <Component />;
    }

    return <Login />;
  });

export default withAuth;
