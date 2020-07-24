import { Capacitor, Plugins } from '@capacitor/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useAuth } from '@motech-development/auth';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import IonCardButton from '../components/IonCardButton';

const { Browser } = Plugins;

const LogIn: FC = () => {
  const { buildAuthorizeUrl, loginWithRedirect } = useAuth();
  const { t } = useTranslation('log-in');
  const login = async () => {
    const params = {
      appState: {
        targetUrl: '/my-companies',
      },
    };

    if (Capacitor.isNative) {
      const url = await buildAuthorizeUrl(params);

      await Browser.open({
        presentationStyle: 'popover',
        url,
      });
    } else {
      await loginWithRedirect(params);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="dark">
          <IonTitle>{t('global:app-name')}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent color="dark">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{t('welcome')}</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>{t('intro')}</IonCardContent>

          <IonCardButton>
            <IonButton expand="full" onClick={login}>
              {t('log-in')}
            </IonButton>
          </IonCardButton>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default memo(LogIn);
