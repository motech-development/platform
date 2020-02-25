import { PageTitle } from '@motech-development/breeze-ui';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import withLayout from '../../hoc/withLayout';

const UpdateDetails: FC = () => {
  const { t } = useTranslation('my-companies');

  return (
    <>
      <PageTitle
        title={t('update-details.title')}
        subTitle={t('update-details.sub-title')}
      />
    </>
  );
};

export default withLayout(UpdateDetails);
