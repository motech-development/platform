import { Plugins, StatusBarStyle } from '@capacitor/core';
import { IonLoading, IonPage, isPlatform } from '@ionic/react';
import { useAuth } from '@motech-development/auth';
import React, { ComponentType, memo, Suspense, useEffect } from 'react';
import LogIn from '../pages/LogIn';

const { StatusBar } = Plugins;

const bootstrap = (Component: ComponentType) =>
  memo(() => {
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
      if (isPlatform('capacitor')) {
        (async () => {
          await StatusBar.setStyle({
            style: StatusBarStyle.Dark,
          });
        })();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading) {
      return (
        <IonPage color="dark">
          <IonLoading isOpen data-testid="auth-loading" />
        </IonPage>
      );
    }

    return (
      <Suspense fallback={<IonLoading isOpen />}>
        {isAuthenticated ? <Component /> : <LogIn />}
      </Suspense>
    );
  });

export default bootstrap;
