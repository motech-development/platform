import { useQuery } from '@apollo/client';
import {
  Card,
  LinkButton,
  Masonry,
  PageTitle,
  Typography,
} from '@motech-development/breeze-ui';
import React, { FC, Fragment, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Connected from '../../components/Connected';
import GET_COMPANY, {
  IGetCompanyInput,
  IGetCompanyOutput,
} from '../../graphql/company/GET_COMPANY';

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
    ...['accounts', 'clients', 'settings'].map(name => ({
      button: t(`${name}.button`),
      colour: 'primary' as const,
      lead: t(`${name}.lead`),
      link: `/my-companies/${name}/${companyId}`,
      title: t(`${name}.title`),
    })),
    {
      button: t('company-details.button'),
      colour: 'primary' as const,
      lead: t('company-details.lead'),
      link: `/my-companies/update-details/${companyId}`,
      title: t('company-details.title'),
    },
    {
      button: t('my-companies.button'),
      colour: 'danger' as const,
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

export default memo(Dashboard);
