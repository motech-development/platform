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
import { useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';
import GET_CLIENTS, {
  IGetClientsInput,
  IGetClientsOutput,
} from '../../../graphql/GET_CLIENTS';
import withLayout from '../../../hoc/withLayout';

interface IClientsParams {
  companyId: string;
}

const Clients: FC = () => {
  const { companyId } = useParams<IClientsParams>();
  const { t } = useTranslation(['clients', 'global']);
  const { data, error, loading } = useQuery<
    IGetClientsOutput,
    IGetClientsInput
  >(GET_CLIENTS, {
    variables: {
      id: companyId,
    },
  });

  return (
    <Connected error={error} loading={loading}>
      {data && (
        <>
          <PageTitle
            title={t('clients.title')}
            subTitle={data.getCompany.name}
          />

          <Row>
            <Col sm={12} md={4} lg={3}>
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
            </Col>

            {data.getClients.items.map(({ id, name, contact }) => (
              <Col key={id} sm={12} md={4} lg={3}>
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
              </Col>
            ))}

            <Col sm={12} md={4} lg={3}>
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
            </Col>
          </Row>
        </>
      )}
    </Connected>
  );
};

export default withLayout(Clients);
