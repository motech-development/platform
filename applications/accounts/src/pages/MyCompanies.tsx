import { Content, LinkButton, PageTitle } from '@motech-development/breeze-ui';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import withLayout from '../hoc/withLayout';

const MyCompanies: FC = () => {
  const { t } = useTranslation('my-companies');

  return (
    <>
      <PageTitle title={t('title')} subTitle={t('sub-title')} />

      <Content>
        <LinkButton to="my-companies/add-company">
          {t('add-company')}
        </LinkButton>
      </Content>
    </>
  );
};

export default withLayout(MyCompanies);
