import { useQuery } from '@apollo/client';
import {
  Card,
  LinkButton,
  Masonry,
  PageTitle,
  Typography,
} from '@motech-development/breeze-ui';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';
import { gql } from '../../../graphql';
import invariant from '../../../utils/invariant';

export const GET_CLIENTS = gql(/* GraphQL */ `
  query GetClients($id: ID!) {
    getClients(id: $id) {
      id
      items {
        address {
          line1
          line2
          line3
          line4
          line5
        }
        contact {
          email
          telephone
        }
        id
        name
      }
    }
    getCompany(id: $id) {
      id
      name
    }
  }
`);

function Clients() {
  const { companyId } = useParams();

  invariant(companyId);

  const { t } = useTranslation(['clients', 'global']);
  const { data, error, loading } = useQuery(GET_CLIENTS, {
    variables: {
      id: companyId,
    },
  });

  return (
    <Connected error={error} loading={loading}>
      {data?.getCompany && (
        <>
          <PageTitle
            title={t('clients.title')}
            subTitle={data.getCompany.name}
          />

          <Masonry xs={1} sm={2} md={3} lg={4}>
            <>
              <Card padding="lg">
                <Typography rule component="h3" variant="h3" margin="lg">
                  {t('clients.new-client')}
                </Typography>

                <Typography component="p" variant="lead" margin="none">
                  {t('clients.enroll-text')}
                </Typography>
              </Card>

              <LinkButton
                block
                to={`/my-companies/clients/${companyId}/add-client`}
                size="lg"
              >
                {t('clients.add-client')}
              </LinkButton>
            </>

            {data.getClients?.items.map(({ id, name, contact }) => (
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
                    {t('clients.email-address')}
                  </Typography>

                  <Typography
                    breakWord
                    component="p"
                    variant="p"
                    align="center"
                    margin="lg"
                  >
                    {contact.email}
                  </Typography>

                  <Typography component="h4" variant="h5" align="center">
                    {t('clients.telephone-number')}
                  </Typography>

                  <Typography
                    component="p"
                    variant="p"
                    align="center"
                    margin="none"
                  >
                    {contact.telephone}
                  </Typography>
                </Card>

                <LinkButton
                  block
                  to={`/my-companies/clients/${companyId}/update-details/${id}`}
                  size="lg"
                >
                  {t('clients.update-details')}
                </LinkButton>
              </Fragment>
            ))}

            <>
              <Card padding="lg">
                <Typography rule component="h3" variant="h3" margin="lg">
                  {t('go-back.title')}
                </Typography>

                <Typography component="p" variant="lead" margin="none">
                  {t('go-back.lead')}
                </Typography>
              </Card>

              <LinkButton
                block
                size="lg"
                colour="danger"
                to={`/my-companies/dashboard/${companyId}`}
              >
                {t('go-back.button')}
              </LinkButton>
            </>
          </Masonry>
        </>
      )}
    </Connected>
  );
}

export default Clients;
