import { useQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Card,
  LinkButton,
  Masonry,
  PageTitle,
  Typography,
} from '@motech-development/breeze-ui';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import Connected from '../../components/Connected';
import GET_COMPANIES, {
  IGetCompaniesInput,
  IGetCompaniesOutput,
} from '../../graphql/company/GET_COMPANIES';

function MyCompanies() {
  const { t } = useTranslation('my-companies');
  const { user } = useAuth0();
  const { data, error, loading } = useQuery<
    IGetCompaniesOutput,
    IGetCompaniesInput
  >(GET_COMPANIES, {
    variables: {
      id: user?.sub as string,
    },
  });

  return (
    <Connected error={error} loading={loading}>
      {data?.getCompanies && (
        <>
          <PageTitle
            title={t('my-companies.title')}
            subTitle={t('my-companies.sub-title')}
          />

          <Masonry xs={1} sm={2} md={3} lg={4}>
            <>
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
            </>

            {data.getCompanies.items.map(({ companyNumber, id, name }) => (
              <Fragment key={id}>
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
                    margin="none"
                  >
                    {companyNumber}
                  </Typography>
                </Card>

                <LinkButton
                  block
                  data-testid={name}
                  to={`/my-companies/dashboard/${id}`}
                  size="lg"
                >
                  {t('my-companies.select-company')}
                </LinkButton>
              </Fragment>
            ))}
          </Masonry>
        </>
      )}
    </Connected>
  );
}

export default MyCompanies;
