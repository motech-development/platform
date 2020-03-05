import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorCard from '../components/ErrorCard';
import withLayout from '../hoc/withLayout';

const NotFound: FC = () => {
  const { t } = useTranslation('not-found');

  return <ErrorCard title={t('not-found')} description={t('description')} />;
};

export default withLayout(NotFound);
