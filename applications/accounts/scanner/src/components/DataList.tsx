import { IonLabel, IonList, IonListHeader } from '@ionic/react';
import React, { Fragment, memo, ReactNode } from 'react';
import ErrorCard from './ErrorCard';

export interface IDataListProps<T> {
  header?: string;
  items: T[];
  noResults: string;
  row: (item: T) => ReactNode;
}

function DataList<T>({ header, items, noResults, row }: IDataListProps<T>) {
  if (items.length === 0) {
    return <ErrorCard description={noResults} />;
  }

  return (
    <IonList>
      {header && (
        <IonListHeader>
          <IonLabel>{header}</IonLabel>
        </IonListHeader>
      )}

      {items.map((item, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={i}>{row(item)}</Fragment>
      ))}
    </IonList>
  );
}

export default memo(DataList) as typeof DataList;
