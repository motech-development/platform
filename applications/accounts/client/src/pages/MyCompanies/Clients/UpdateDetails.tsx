import {
  ApolloCache,
  MutationUpdaterFunction,
  Reference,
  useMutation,
  useQuery,
} from '@apollo/client';
import {
  Button,
  Col,
  PageTitle,
  Row,
  useToast,
} from '@motech-development/breeze-ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import ClientForm, { FormSchema } from '../../../components/ClientForm';
import Connected from '../../../components/Connected';
import DeleteItem from '../../../components/DeleteItem';
import { gql } from '../../../graphql';
import {
  DeleteClientMutation,
  MutationDeleteClientArgs,
} from '../../../graphql/graphql';
import invariant from '../../../utils/invariant';

export const update: MutationUpdaterFunction<
  DeleteClientMutation,
  MutationDeleteClientArgs,
  unknown,
  ApolloCache<unknown>
> = (cache, { data }) => {
  if (data?.deleteClient) {
    const { deleteClient } = data;

    cache.modify({
      fields: {
        items: (refs: readonly Reference[], { readField }) =>
          refs.filter((ref) => readField('id', ref) !== deleteClient.id),
      },
      id: cache.identify({
        __typename: 'Clients',
        id: deleteClient.companyId,
      }),
    });
  }
};

export const GET_CLIENT = gql(/* GraphQL */ `
  query GetClient($id: ID!) {
    getClient(id: $id) {
      address {
        line1
        line2
        line3
        line4
        line5
      }
      companyId
      contact {
        email
        telephone
      }
      id
      name
    }
  }
`);

export const UPDATE_CLIENT = gql(/* GraphQL */ `
  mutation UpdateClient($input: ClientInput!) {
    updateClient(input: $input) {
      address {
        line1
        line2
        line3
        line4
        line5
      }
      companyId
      contact {
        email
        telephone
      }
      id
      name
    }
  }
`);

export const DELETE_CLIENT = gql(/* GraphQL */ `
  mutation DeleteClient($id: ID!) {
    deleteClient(id: $id) {
      companyId
      id
      name
    }
  }
`);

function UpdateDetails() {
  const backTo = (id: string) => `/my-companies/clients/${id}`;
  const navigate = useNavigate();
  const { t } = useTranslation('clients');
  const { add } = useToast();
  const [modal, setModal] = useState(false);
  const { clientId, companyId } = useParams();

  invariant(clientId);
  invariant(companyId);

  const { data, error, loading } = useQuery(GET_CLIENT, {
    variables: {
      id: clientId,
    },
  });
  const [mutation, { error: updateError, loading: updateLoading }] =
    useMutation(UPDATE_CLIENT, {
      onCompleted: ({ updateClient }) => {
        if (updateClient) {
          const { companyId: id, name } = updateClient;

          add({
            colour: 'success',
            message: t('update-details.success', {
              name,
            }),
          });

          navigate(backTo(id));
        } else {
          add({
            colour: 'danger',
            message: t('update-details.retry'),
          });

          navigate(backTo(companyId));
        }
      },
    });
  const [deleteMutation, { error: deleteError, loading: deleteLoading }] =
    useMutation(DELETE_CLIENT, {
      onCompleted: ({ deleteClient }) => {
        if (deleteClient) {
          const { companyId: id, name } = deleteClient;

          add({
            colour: 'success',
            message: t('delete-client.success', {
              name,
            }),
          });

          navigate(backTo(id));
        } else {
          add({
            colour: 'danger',
            message: t('delete-client.retry'),
          });

          navigate(backTo(companyId));
        }
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
    deleteMutation({
      update,
      variables: {
        id: clientId,
      },
    }).catch(() => {});
  };
  const save = (input: FormSchema) => {
    mutation({
      variables: {
        input,
      },
    }).catch(() => {});
  };

  return (
    <Connected error={error || deleteError || updateError} loading={loading}>
      {data?.getClient && (
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
}

export default UpdateDetails;
