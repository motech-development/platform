import {
  IonButton,
  IonDatetime,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
} from '@ionic/react';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';

const TransactionForm: FC = () => {
  const { t } = useTranslation('transaction-form');

  return (
    <>
      <IonList>
        <IonItem>
          <IonLabel position="floating">{t('name.label')}</IonLabel>
          <IonInput />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">{t('description.label')}</IonLabel>
          <IonInput />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">{t('date.label')}</IonLabel>
          <IonDatetime />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">{t('category.label')}</IonLabel>
          <IonSelect />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">{t('amount.label')}</IonLabel>
          <IonInput />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">{t('vat.label')}</IonLabel>
          <IonInput />
        </IonItem>
      </IonList>

      <div className="ion-padding">
        <IonButton
          color="tertiary"
          expand="block"
          className="ion-margin-bottom"
        >
          {t('buttons.scan-receipt')}
        </IonButton>

        <IonButton color="secondary" expand="block">
          {t('buttons.save')}
        </IonButton>
      </div>
    </>
  );
};

export default memo(TransactionForm);
