import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { FC, memo, ReactNode } from 'react';

export interface IPageProps {
  children: ReactNode;
  defaultHref?: string;
  title: string;
}

const Page: FC<IPageProps> = ({ children, defaultHref, title }) => (
  <IonPage>
    <IonHeader translucent>
      <IonToolbar color="dark">
        <IonButtons slot="start">
          <IonBackButton defaultHref={defaultHref} />
        </IonButtons>

        <IonTitle>{title}</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent fullscreen color="dark">
      <IonHeader collapse="condense">
        <IonToolbar color="dark">
          <IonTitle size="large">{title}</IonTitle>
        </IonToolbar>
      </IonHeader>

      {children}
    </IonContent>
  </IonPage>
);

export default memo(Page);
