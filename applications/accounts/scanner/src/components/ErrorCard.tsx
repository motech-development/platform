import { IonButton, IonCard, IonCardContent } from '@ionic/react';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import IonCardButton from './IonCardButton';

export interface IErrorCardProps {
  backTo?: string;
  description: string;
}

const ErrorCard: FC<IErrorCardProps> = ({ backTo, description }) => {
  const history = useHistory();
  const { t } = useTranslation('error-card');
  const goBack = () => {
    if (backTo) {
      history.push(backTo);
    } else {
      history.goBack();
    }
  };

  return (
    <IonCard>
      <IonCardContent>{description}</IonCardContent>

      <IonCardButton>
        <IonButton expand="full" onClick={goBack}>
          {t('go-back')}
        </IonButton>
      </IonCardButton>
    </IonCard>
  );
};

export default memo(ErrorCard);
