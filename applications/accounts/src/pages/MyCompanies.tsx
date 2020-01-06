import { PageTitle } from '@motech-development/breeze-ui';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import withLayout from '../hoc/withLayout';

const MyCompanies: FC = () => {
  const { t } = useTranslation('my-companies');

  return (
    <>
      <PageTitle title={t('title')} subTitle={t('sub-title')} />
    </>
  );
};

export default withLayout(MyCompanies);
