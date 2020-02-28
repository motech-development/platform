import { PageTitle } from '@motech-development/breeze-ui';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import withLayout from '../../hoc/withLayout';
import CompanyForm from '../../components/CompanyForm';

const AddCompany: FC = () => {
  const { t } = useTranslation('my-companies');

  function save() {}

  return (
    <>
      <PageTitle
        title={t('add-company.title')}
        subTitle={t('add-company.sub-title')}
      />

      <CompanyForm backTo="/my-companies" onSave={save} />
    </>
  );
};

export default withLayout(AddCompany);
