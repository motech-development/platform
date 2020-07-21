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
import styled from 'styled-components';

const IonCardButton = styled(IonCardContent)`
  padding-top: 0;
`;

const LogIn: FC = () => {
  const { loginWithRedirect } = useAuth();
  const { t } = useTranslation('log-in');
  const login = () =>
    loginWithRedirect({
      appState: {
        targetUrl: '/receipts',
      },
    });

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
