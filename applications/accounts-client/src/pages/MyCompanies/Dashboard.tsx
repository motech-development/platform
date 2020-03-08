import { useQuery } from '@apollo/react-hooks';
import {
  Card,
  LinkButton,
  Masonry,
  PageTitle,
  Typography,
} from '@motech-development/breeze-ui';
import React, { FC, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Connected from '../../components/Connected';
import GET_COMPANY, {
  IGetCompanyInput,
  IGetCompanyOutput,
} from '../../graphql/company/GET_COMPANY';
import withLayout from '../../hoc/withLayout';

interface IDashboardParams {
  companyId: string;
}

const Dashboard: FC = () => {
  const { companyId } = useParams<IDashboardParams>();
  const { data, error, loading } = useQuery<
    IGetCompanyOutput,
    IGetCompanyInput
  >(GET_COMPANY, {
    variables: {
      id: companyId,
    },
  });
  const { t } = useTranslation('dashboard');
  const cards = [
    {
      button: t('settings.button'),
      colour: 'primary',
      lead: t('settings.lead'),
      link: `/my-companies/settings/${companyId}`,
      title: t('settings.title'),
    },
    {
      button: t('accounts.button'),
      colour: 'primary',
      lead: t('accounts.lead'),
      link: `/my-companies/accounts/${companyId}`,
      title: t('accounts.title'),
    },
    {
      button: t('clients.button'),
      colour: 'primary',
      lead: t('clients.lead'),
      link: `/my-companies/clients/${companyId}`,
      title: t('clients.title'),
    },
    {
      button: t('company-details.button'),
      colour: 'primary',
      lead: t('company-details.lead'),
      link: `/my-companies/update-details/${companyId}`,
      title: t('company-details.title'),
    },
    {
      button: t('my-companies.button'),
      colour: 'danger',
      lead: t('my-companies.lead'),
      link: '/my-companies',
      title: t('my-companies.title'),
    },
  ];

  return (
    <Connected error={error} loading={loading}>
      {data && (
        <>
          <PageTitle title={data.getCompany.name} subTitle={t('sub-title')} />

          <Masonry xs={1} sm={2} md={3} lg={4}>
            {cards.map(({ button, colour, lead, link, title }) => (
              <Fragment key={title}>
                <Card padding="lg">
                  <Typography rule component="h3" variant="h3" margin="lg">
                    {title}
                  </Typography>

                  <Typography component="p" variant="lead" margin="none">
                    {lead}
                  </Typography>
                </Card>

                <LinkButton block size="lg" to={link} colour={colour}>
                  {button}
                </LinkButton>
              </Fragment>
            ))}
          </Masonry>
        </>
      )}
    </Connected>
  );
};

export default withLayout(Dashboard);
