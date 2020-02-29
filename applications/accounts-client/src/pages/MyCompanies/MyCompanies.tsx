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
import withLayout from '../../hoc/withLayout';

const data = [...Array(6)].map((_, i) => ({
  companyNumber: `0000000${i}`,
  name: `New company ${i}`,
  pk: `uuid-${i}`,
  vatRegistration: i === 4 ? undefined : `GB00000000${i}`,
}));

const MyCompanies: FC = () => {
  const { t } = useTranslation('my-companies');

  return (
    <>
      <PageTitle
        title={t('my-companies.title')}
        subTitle={t('my-companies.sub-title')}
      />

      <Row>
        <Col sm={12} md={4} lg={3}>
          <Card padding="lg">
            <Typography rule component="h3" variant="h3" margin="lg">
              {t('my-companies.new-company')}
            </Typography>

            <Typography component="p" variant="lead" margin="none">
              {t('my-companies.enroll-text')}
            </Typography>
          </Card>

          <LinkButton block to="my-companies/add-company" size="lg">
            {t('my-companies.add-company')}
          </LinkButton>
        </Col>

        {data.map(({ companyNumber, name, pk, vatRegistration }) => (
          <Col sm={12} md={4} lg={3} key={pk}>
            <Card padding="lg">
              <Typography
                rule
                component="h3"
                variant="h3"
                align="center"
                margin="lg"
              >
                {name}
              </Typography>

              <Typography component="h4" variant="h5" align="center">
                {t('my-companies.company-number')}
              </Typography>

              <Typography
                component="p"
                variant="p"
                align="center"
                margin={vatRegistration ? 'lg' : 'none'}
              >
                {companyNumber}
              </Typography>

              {vatRegistration && (
                <>
                  <Typography component="h4" variant="h5" align="center">
                    {t('my-companies.vat-registration')}
                  </Typography>
                  <Typography
                    component="p"
                    variant="p"
                    align="center"
                    margin="none"
                  >
                    {vatRegistration}
                  </Typography>
                </>
              )}
            </Card>

            <LinkButton block to={`/dashboard/${pk}`} size="lg">
              {t('my-companies.select-company')}
            </LinkButton>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default withLayout(MyCompanies);
