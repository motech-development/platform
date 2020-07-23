import { Plugins } from '@capacitor/core';
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
  isPlatform,
} from '@ionic/react';
import { useAuth } from '@motech-development/auth';
import React, { FC, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

const { App, Browser } = Plugins;

const IonCardButton = styled(IonCardContent)`
  padding-top: 0;
`;

const LogIn: FC = () => {
  const { buildAuthorizeUrl, loginWithRedirect } = useAuth();
  const { t } = useTranslation('log-in');
  const history = useHistory();
  const login = async () => {
    const params = {
      appState: {
        targetUrl: '/receipts',
      },
    };

    if (isPlatform('capacitor')) {
      const url = await buildAuthorizeUrl(params);

      await Browser.open({
        presentationStyle: 'popover',
        url,
      });
    } else {
      await loginWithRedirect(params);
    }
  };

  useEffect(() => {
    App.addListener('appUrlOpen', async ({ url }) => {
      if (url) {
        await Browser.close();

        const { pathname, search } = new URL(url);

        history.push(pathname + search);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
