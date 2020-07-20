import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { FC, memo, ReactNode } from 'react';

export interface IPageProps {
  children: ReactNode;
  title: string;
}

const Page: FC<IPageProps> = ({ children, title }) => (
  <IonPage>
    <IonHeader>
      <IonToolbar color="dark">
        <IonTitle>{title}</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">{title}</IonTitle>
        </IonToolbar>
      </IonHeader>

      {children}
    </IonContent>
  </IonPage>
);

export default memo(Page);
