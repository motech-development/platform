import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonPage,
} from '@ionic/react';
import { useAuth } from '@motech-development/auth';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
`;

const IonCardButton = styled(IonCardContent)`
  padding-top: 0;
`;

const LogIn: FC = () => {
  const { loginWithRedirect } = useAuth();
  const { t } = useTranslation('log-in');
  const login = () =>
    loginWithRedirect({
      appState: {
        targetUrl: '/my-companies',
      },
    });

  return (
    <IonPage>
      <IonContent>
        <Wrapper>
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
        </Wrapper>
      </IonContent>
    </IonPage>
  );
};

export default memo(LogIn);
