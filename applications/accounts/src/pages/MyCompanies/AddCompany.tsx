import { PageTitle } from '@motech-development/breeze-ui';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import withLayout from '../../hoc/withLayout';

const AddCompany: FC = () => {
  const { t } = useTranslation('my-companies');

  return (
    <>
      <PageTitle
        title={t('add-company.title')}
        subTitle={t('add-company.sub-title')}
      />
    </>
  );
};

export default withLayout(AddCompany);
