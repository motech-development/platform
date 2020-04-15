import React, { FC, memo, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorCard from './ErrorCard';

export interface IDataListProps<T = unknown> {
  children: ReactNode;
  items: T[];
}

const DataList: FC<IDataListProps> = ({ children, items }) => {
  const { t } = useTranslation('data-list');

  if (items.length === 0) {
    return <ErrorCard title={t('title')} description={t('description')} />;
  }

  return <>{children}</>;
};

export default memo(DataList);
