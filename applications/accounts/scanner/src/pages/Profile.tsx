import { IonButton } from '@ionic/react';
import { useAuth } from '@motech-development/auth';
import React, { FC, memo } from 'react';
import Page from '../components/Page';

const Profile: FC = () => {
  const { logout, user } = useAuth();
  const logOut = () =>
    logout({
      returnTo: window.location.origin,
    });

  if (!user) {
    return null;
  }

  return (
    <Page title={user.name}>
      <IonButton onClick={logOut}>Log out</IonButton>
    </Page>
  );
};

export default memo(Profile);
