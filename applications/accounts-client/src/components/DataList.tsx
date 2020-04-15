import React, { memo, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorCard from './ErrorCard';

export interface IDataListProps<T> {
  items: T[];
  render: (items: T[]) => ReactNode;
}

function DataList<T>({ items, render }: IDataListProps<T>) {
  const { t } = useTranslation('data-list');

  if (items.length === 0) {
    return <ErrorCard title={t('title')} description={t('description')} />;
  }

  return <>{render(items)}</>;
}

export default memo(DataList) as typeof DataList;
