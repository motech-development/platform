import { PageTitle } from '@motech-development/breeze-ui';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import withLayout from '../../hoc/withLayout';
import CompanyForm from '../../components/CompanyForm';

const initialValues = {
  address: {
    line1: '1 Street',
    line2: '',
    line3: 'Town',
    line4: 'County',
    line5: 'KT1 1NE',
  },
  bank: {
    accountNumber: '12345678',
    sortCode: '12-34-56',
  },
  companyNumber: '12345678',
  contact: {
    email: 'info@contact.com',
    telephone: '07712345678',
  },
  name: 'New company',
  vatRegistration: 'GB123456789',
};

const UpdateDetails: FC = () => {
  const { t } = useTranslation('my-companies');

  function save() {}

  return (
    <>
      <PageTitle
        title={t('update-details.title')}
        subTitle={t('update-details.sub-title')}
      />

      <CompanyForm
        initialValues={initialValues}
        backTo="/my-companies"
        onSave={save}
      />
    </>
  );
};

export default withLayout(UpdateDetails);
