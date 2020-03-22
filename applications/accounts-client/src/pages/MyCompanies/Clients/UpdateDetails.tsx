import { useMutation, useQuery } from '@apollo/react-hooks';
import {
  Button,
  Col,
  Modal,
  PageTitle,
  Row,
  Typography,
  useToast,
} from '@motech-development/breeze-ui';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import ClientForm, { FormSchema } from '../../../components/ClientForm';
import ConfirmDelete from '../../../components/ConfirmDelete';
import Connected from '../../../components/Connected';
import DELETE_CLIENT, {
  IDeleteClientInput,
  IDeleteClientOutput,
  updateCache,
} from '../../../graphql/client/DELETE_CLIENT';
import GET_CLIENT, {
  IGetClientInput,
  IGetClientOutput,
} from '../../../graphql/client/GET_CLIENT';
import UPDATE_CLIENT, {
  IUpdateClientInput,
  IUpdateClientOutput,
} from '../../../graphql/client/UPDATE_CLIENT';
import withLayout from '../../../hoc/withLayout';

interface IUpdateDetailsParams {
  clientId: string;
  companyId: string;
}

const UpdateDetails: FC = () => {
  const backTo = (id: string) => `/my-companies/clients/${id}`;
  const history = useHistory();
  const { t } = useTranslation('clients');
  const { add } = useToast();
  const [modal, setModal] = useState(false);
  const { clientId } = useParams<IUpdateDetailsParams>();
  const { data, error, loading } = useQuery<IGetClientOutput, IGetClientInput>(
    GET_CLIENT,
    {
      variables: {
        id: clientId,
      },
    },
  );
  const [
    mutation,
    { error: updateError, loading: updateLoading },
  ] = useMutation<IUpdateClientOutput, IUpdateClientInput>(UPDATE_CLIENT, {
    onCompleted: ({ updateClient }) => {
      const { companyId, name } = updateClient;

      add({
        colour: 'success',
        message: t('update-details.success', {
          name,
        }),
      });

      history.push(backTo(companyId));
    },
  });
  const [
    deleteMutation,
    { error: deleteError, loading: deleteLoading },
  ] = useMutation<IDeleteClientOutput, IDeleteClientInput>(DELETE_CLIENT, {
    onCompleted: ({ deleteClient }) => {
      const { companyId, name } = deleteClient;

      add({
        colour: 'success',
        message: t('delete-client.success', {
          name,
        }),
      });

      history.push(backTo(companyId));
    },
    onError: () => {
      add({
        colour: 'danger',
        message: t('delete-client.error'),
      });
    },
  });
  const launchDeleteModal = () => {
    setModal(true);
  };
  const onDismiss = () => {
    setModal(false);
  };
  const onDelete = () => {
    (async () => {
      await deleteMutation({
        update: updateCache,
        variables: {
          id: clientId,
        },
      });
    })();
  };
  const save = (input: FormSchema) => {
    (async () => {
      await mutation({
        variables: {
          input,
        },
      });
    })();
  };

  return (
    <Connected error={error || deleteError || updateError} loading={loading}>
      {data && (
        <>
          <PageTitle
            title={data.getClient.name}
            subTitle={t('update-details.sub-title')}
          />

          <Row>
            <Col>
              <ClientForm
                backTo={backTo(data.getClient.companyId)}
                initialValues={data.getClient}
                loading={updateLoading}
                onSave={save}
              />
            </Col>

            <Col xs={12} md={6} mdOffset={7}>
              <Button
                block
                colour="danger"
                size="lg"
                onClick={launchDeleteModal}
              >
                {t('update-details.delete-client', {
                  name: data.getClient.name,
                })}
              </Button>
            </Col>
          </Row>

          <Modal isOpen={modal} onDismiss={onDismiss}>
            <Typography rule component="h3" variant="h3" margin="lg">
              {t('delete-client.title', {
                name: data.getClient.name,
              })}
            </Typography>

            <Typography component="p" variant="p">
              {t('delete-client.warning')}
            </Typography>

            <ConfirmDelete
              loading={deleteLoading}
              name={data.getClient.name}
              onCancel={onDismiss}
              onDelete={onDelete}
            />
          </Modal>
        </>
      )}
    </Connected>
  );
};

export default withLayout(UpdateDetails);
