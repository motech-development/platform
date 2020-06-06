import { useMutation, useQuery } from '@apollo/react-hooks';
import {
  Button,
  Col,
  PageTitle,
  Row,
  useToast,
} from '@motech-development/breeze-ui';
import React, { FC, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import ClientForm, { FormSchema } from '../../../components/ClientForm';
import Connected from '../../../components/Connected';
import DeleteItem from '../../../components/DeleteItem';
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
  const onDelete = async () => {
    await deleteMutation({
      update: updateCache,
      variables: {
        id: clientId,
      },
    });
  };
  const save = async (input: FormSchema) => {
    await mutation({
      variables: {
        input,
      },
    });
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

          <DeleteItem
            title={t('delete-client.title', {
              name: data.getClient.name,
            })}
            warning={t('delete-client.warning')}
            display={modal}
            loading={deleteLoading}
            name={data.getClient.name}
            onDelete={onDelete}
            onDismiss={onDismiss}
          />
        </>
      )}
    </Connected>
  );
};

export default memo(UpdateDetails);
