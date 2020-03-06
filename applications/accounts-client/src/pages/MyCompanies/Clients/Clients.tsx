import {
  Card,
  Col,
  LinkButton,
  PageTitle,
  Row,
  Typography,
} from '@motech-development/breeze-ui';
import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import withLayout from '../../../hoc/withLayout';

interface IClientsParams {
  companyId: string;
}

const Clients: FC = () => {
  const { companyId } = useParams<IClientsParams>();

  return (
    <>
      <PageTitle
        title="Clients"
        subTitle="Manage your client details to easily invoice them"
      />
      <Row>
        <Col sm={12} md={4} lg={3}>
          <Card padding="lg">
            <Typography rule component="h3" variant="h3" margin="lg">
              New client
            </Typography>

            <Typography component="p" variant="lead" margin="none">
              Add a new client so that you will always have their details to
              hand
            </Typography>
          </Card>

          <LinkButton block to={`/clients/${companyId}/add-client`} size="lg">
            Add a new client
          </LinkButton>
        </Col>
      </Row>
    </>
  );
};

export default withLayout(Clients);
