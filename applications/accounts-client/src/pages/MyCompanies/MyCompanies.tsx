import { useQuery } from '@apollo/react-hooks';
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
import Connected from '../../components/Connected';
import GET_COMPANIES, {
  IGetCompaniesInput,
  IGetCompaniesOutput,
} from '../../graphql/company/GET_COMPANIES';
import withLayout from '../../hoc/withLayout';

const MyCompanies: FC = () => {
  const { t } = useTranslation('my-companies');
  const { data, error, loading } = useQuery<
    IGetCompaniesOutput,
    IGetCompaniesInput
  >(GET_COMPANIES);

  return (
    <Connected error={error} loading={loading}>
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

          <LinkButton block to="/my-companies/add-company" size="lg">
            {t('my-companies.add-company')}
          </LinkButton>
        </Col>

        {data &&
          data.getCompanies.items.map(
            ({ companyNumber, id, name, vatRegistration }) => (
              <Col sm={12} md={4} lg={3} key={id}>
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

                <LinkButton
                  block
                  to={`/my-companies/dashboard/${id}`}
                  size="lg"
                >
                  {t('my-companies.select-company')}
                </LinkButton>
              </Col>
            ),
          )}
      </Row>
    </Connected>
  );
};

export default withLayout(MyCompanies);
