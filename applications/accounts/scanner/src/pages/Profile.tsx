import {
  IonAvatar,
  IonButton,
  IonItem,
  IonLabel,
  IonLoading,
} from '@ionic/react';
import { useAuth } from '@motech-development/auth';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import Page from '../components/Page';

const Profile: FC = () => {
  const { logout, user } = useAuth();
  const { t } = useTranslation('profile');
  const logOut = () =>
    logout({
      returnTo: window.location.origin,
    });

  if (!user) {
    return <IonLoading isOpen data-testid="profile-loading" />;
  }

  return (
    <Page title={t('title')}>
      <div className="ion-padding">
        <IonItem>
          {user.picture && (
            <IonAvatar slot="start">
              <img src={user.picture} alt="" />
            </IonAvatar>
          )}

          <IonLabel>
            <h2>{user.name}</h2>

            <p>{user.email}</p>
          </IonLabel>
        </IonItem>

        <IonButton expand="full" color="danger" onClick={logOut}>
          {t('log-out')}
        </IonButton>
      </div>
    </Page>
  );
};

export default memo(Profile);
