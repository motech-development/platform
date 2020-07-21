import { IonItem, IonLabel, IonList, IonNote } from '@ionic/react';
import { DateTime } from '@motech-development/breeze-ui';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import Page from '../components/Page';

const data = [...Array(30)].map((_, i) => ({
  date: '2020-07-24T06:57:02Z',
  description: 'Some kind of description',
  id: `test-id-${i}`,
  name: 'Supplier name',
}));

const Receipts: FC = () => {
  const { t } = useTranslation('receipts');

  return (
    <Page title={t('title')}>
      <IonList>
        {data.map(({ date, description, id, name }) => (
          <IonItem key={id} routerLink={`transaction/${id}`}>
            <IonLabel>
              <h2>{name}</h2>

              <p>{description}</p>
            </IonLabel>

            <IonNote slot="end">
              <DateTime value={date} />
            </IonNote>
          </IonItem>
        ))}
      </IonList>
    </Page>
  );
};

export default memo(Receipts);
