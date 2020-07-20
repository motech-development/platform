import { IonLoading } from '@ionic/react';
import { useAuth } from '@motech-development/auth';
import React, { ComponentType, memo, Suspense } from 'react';
import LogIn from '../pages/LogIn';

const withAuth = (Component: ComponentType) =>
  memo(() => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return <IonLoading isOpen />;
    }

    return (
      <Suspense fallback={<IonLoading isOpen />}>
        {isAuthenticated ? <Component /> : <LogIn />}
      </Suspense>
    );
  });

export default withAuth;
