import { useQuery } from '@apollo/react-hooks';
import {
  Button,
  Card,
  LinkButton,
  Masonry,
  Modal,
  PageTitle,
  Typography,
} from '@motech-development/breeze-ui';
import React, { FC, Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ConfirmDelete from '../../../components/ConfirmDelete';
import Connected from '../../../components/Connected';
import GET_CLIENTS, {
  IGetClientsInput,
  IGetClientsOutput,
} from '../../../graphql/client/GET_CLIENTS';
import withLayout from '../../../hoc/withLayout';

interface IDeleteModal {
  id: string | null;
  name: string | null;
}

interface IClientsParams {
  companyId: string;
}

const Clients: FC = () => {
  const { companyId } = useParams<IClientsParams>();
  const { t } = useTranslation(['clients', 'global']);
  const [modal, setModal] = useState(false);
  const [client, setClient] = useState<IDeleteModal>({
    id: null,
    name: null,
  });
  const { data, error, loading } = useQuery<
    IGetClientsOutput,
    IGetClientsInput
  >(GET_CLIENTS, {
    variables: {
      id: companyId,
    },
  });
  const launchDelete = (id: string, name: string) => {
    setClient({
      id,
      name,
    });
  };
  const onDismiss = () => {
    setClient({
      id: null,
      name: null,
    });
  };

  useEffect(() => {
    const showModal = Boolean(client.id && client.name);

    setModal(showModal);
  }, [client]);

  return (
    <Connected error={error} loading={loading}>
      {data && (
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

            {data.getClients.items.map(({ id, name, contact }) => (
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
                <Button
                  block
                  colour="danger"
                  onClick={() => launchDelete(id, name)}
                >
                  {t('clients.delete-client')}
                </Button>
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

      <Modal isOpen={modal} onDismiss={onDismiss}>
        {client.id && client.name && (
          <>
            <Typography rule component="h3" variant="h3" margin="lg">
              {t('delete-modal.title', {
                name: client.name,
              })}
            </Typography>

            <Typography component="p" variant="p">
              {t('delete-modal.warning')}
            </Typography>

            <ConfirmDelete
              loading={false}
              name={client.name}
              onCancel={onDismiss}
              onDelete={onDismiss}
            />
          </>
        )}
      </Modal>
    </Connected>
  );
};

export default withLayout(Clients);
