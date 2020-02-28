import {
  Card,
  Col,
  LinkButton,
  PageTitle,
  Row,
  Typography,
} from '@motech-development/breeze-ui';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import withLayout from '../hoc/withLayout';

const Dashboard: FC = () => {
  const { companyId } = useParams();
  const { t } = useTranslation('dashboard');

  return (
    <>
      <PageTitle title="Company name" subTitle={t('sub-title')} />

      <Row>
        <Col sm={12} md={4} lg={3}>
          <Card padding="lg">
            <Typography rule component="h3" variant="h3" margin="lg">
              {t('accounts.title')}
            </Typography>

            <Typography component="p" variant="lead" margin="none">
              {t('accounts.lead')}
            </Typography>
          </Card>

          <LinkButton block to={`/company-accounts/${companyId}`} size="lg">
            {t('accounts.button')}
          </LinkButton>
        </Col>

        <Col sm={12} md={4} lg={3}>
          <Card padding="lg">
            <Typography rule component="h3" variant="h3" margin="lg">
              {t('clients.title')}
            </Typography>

            <Typography component="p" variant="lead" margin="none">
              {t('clients.lead')}
            </Typography>
          </Card>

          <LinkButton block to={`/company-clients/${companyId}`} size="lg">
            {t('clients.button')}
          </LinkButton>
        </Col>

        <Col sm={12} md={4} lg={3}>
          <Card padding="lg">
            <Typography rule component="h3" variant="h3" margin="lg">
              {t('my-companies.title')}
            </Typography>

            <Typography component="p" variant="lead" margin="none">
              {t('my-companies.lead')}
            </Typography>
          </Card>

          <LinkButton block to="/my-companies" size="lg">
            {t('my-companies.button')}
          </LinkButton>
        </Col>
      </Row>
    </>
  );
};

export default withLayout(Dashboard);
