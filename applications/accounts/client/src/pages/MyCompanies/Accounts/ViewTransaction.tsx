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
import Connected from '../../../components/Connected';
import DeleteItem from '../../../components/DeleteItem';
import TransactionForm, {
  FormSchema,
} from '../../../components/TransactionForm';
import { gql } from '../../../graphql';
import {
  MutationUpdateTransactionArgs,
  UpdateTransactionMutation,
} from '../../../graphql/graphql';
import invariant from '../../../utils/invariant';
import { findUnique, setItems, spread } from '../../../utils/transactions';
import UploadAttachment from './shared/UploadAttachment';
import ViewAttachment from './shared/ViewAttachment';

const getStatus = (status: string) =>
  status === 'confirmed' ? 'pending' : 'confirmed';

export const update: MutationUpdaterFunction<
  UpdateTransactionMutation,
  MutationUpdateTransactionArgs,
  unknown,
  ApolloCache<unknown>
> = (cache, { data }) => {
  if (data?.updateTransaction) {
    const { updateTransaction } = data;
    const otherStatus = getStatus(updateTransaction.status);

    cache.modify({
      fields: {
        items: (refs: readonly Reference[], { readField }) => {
          if (
            refs.some((ref) => readField('id', ref) === updateTransaction.id)
          ) {
            return [...refs];
          }

          const newRef = cache.writeFragment({
            data: updateTransaction,
            fragment: gql(/* GraphQL */ `
              fragment NewTransaction on Transaction {
                amount
                attachment
                date
                description
                id
                name
                scheduled
              }
            `),
          });

          if (!newRef) {
            return [...refs];
          }

          return [...refs, newRef].sort((a, b) => {
            const readA = readField<string>('date', a);
            const readB = readField<string>('date', b);

            if (readA && readB) {
              return readA.localeCompare(readB);
            }

            return 0;
          });
        },
      },
      id: cache.identify({
        __typename: 'Transactions',
        id: updateTransaction.companyId,
        status: updateTransaction.status,
      }),
    });

    cache.modify({
      fields: {
        items: (refs: readonly Reference[], { readField }) =>
          refs.filter((ref) => readField('id', ref) !== updateTransaction.id),
      },
      id: cache.identify({
        __typename: 'Transactions',
        id: updateTransaction.companyId,
        status: otherStatus,
      }),
    });

    cache.modify({
      fields: {
        purchases: (items: string[] | Reference) => {
          const descriptions = setItems(items);
          const unique = !descriptions.some(
            findUnique(updateTransaction, 'description'),
          );

          if (spread(updateTransaction.category !== 'Sales', unique)) {
            return [...descriptions, updateTransaction.description].sort(
              (a, b) => a.localeCompare(b),
            );
          }

          return descriptions;
        },
        sales: (items: string[] | Reference) => {
          const descriptions = setItems(items);
          const unique = !descriptions.some(
            findUnique(updateTransaction, 'description'),
          );

          if (spread(updateTransaction.category === 'Sales', unique)) {
            return [...descriptions, updateTransaction.description].sort(
              (a, b) => a.localeCompare(b),
            );
          }

          return descriptions;
        },
        suppliers: (items: string[] | Reference) => {
          const suppliers = setItems(items);
          const unique = !suppliers.some(findUnique(updateTransaction, 'name'));

          if (spread(updateTransaction.category !== 'Sales', unique)) {
            return [...suppliers, updateTransaction.name].sort((a, b) =>
              a.localeCompare(b),
            );
          }

          return suppliers;
        },
      },
      id: cache.identify({
        __typename: 'Typeahead',
        id: updateTransaction.companyId,
      }),
    });
  }
};

export const VIEW_TRANSACTION = gql(/* GraphQL */ `
  query ViewTransaction($companyId: ID!, $transactionId: ID!) {
    getClients(id: $companyId) {
      id
      items {
        id
        name
      }
    }
    getSettings(id: $companyId) {
      categories {
        name
        vatRate
      }
      id
      vat {
        pay
      }
    }
    getTransaction(id: $transactionId) {
      amount
      attachment
      category
      companyId
      date
      description
      id
      name
      refund
      scheduled
      status
      vat
    }
    getTypeahead(id: $companyId) {
      id
      purchases
      sales
      suppliers
    }
  }
`);

export const UPDATE_TRANSACTION = gql(/* GraphQL */ `
  mutation UpdateTransaction($input: TransactionInput!) {
    updateTransaction(input: $input) {
      amount
      attachment
      category
      companyId
      date
      description
      id
      name
      scheduled
      status
      vat
    }
  }
`);

export const DELETE_TRANSACTION = gql(/* GraphQL */ `
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id) {
      companyId
      id
      status
    }
  }
`);

function ViewTransaction() {
  const navigate = useNavigate();
  const { companyId, transactionId } = useParams();

  invariant(companyId);
  invariant(transactionId);

  const [attachment, setAttachment] = useState('');
  const [modal, setModal] = useState(false);
  const { t } = useTranslation('accounts');
  const { add } = useToast();
  const backTo = (id: string, status?: string) => {
    const pending = status === 'pending';
    const location = `/my-companies/accounts/${id}`;

    if (pending) {
      return `${location}/pending-transactions`;
    }

    return location;
  };

  const { data, error, loading } = useQuery(VIEW_TRANSACTION, {
    onCompleted: ({ getTransaction }) => {
      if (getTransaction?.attachment) {
        setAttachment(getTransaction.attachment);
      }
    },
    variables: {
      companyId,
      transactionId,
    },
  });
  const [mutation, { error: mutationError, loading: mutationLoading }] =
    useMutation(UPDATE_TRANSACTION, {
      onCompleted: ({ updateTransaction }) => {
        if (updateTransaction) {
          add({
            colour: 'success',
            message: t('view-transaction.success'),
          });

          navigate(
            backTo(updateTransaction.companyId, updateTransaction.status),
          );
        } else {
          add({
            colour: 'danger',
            message: t('view-transaction.retry'),
          });

          navigate(backTo(companyId));
        }
      },
    });
  const [deleteMutation, { loading: deleteLoading }] = useMutation(
    DELETE_TRANSACTION,
    {
      onCompleted: ({ deleteTransaction }) => {
        if (deleteTransaction) {
          add({
            colour: 'success',
            message: t('delete-transaction.success'),
          });

          navigate(
            backTo(deleteTransaction.companyId, deleteTransaction.status),
          );
        } else {
          add({
            colour: 'danger',
            message: t('delete-transaction.retry'),
          });

          navigate(backTo(companyId));
        }
      },
      onError: () => {
        add({
          colour: 'danger',
          message: t('delete-transaction.error'),
        });
      },
    },
  );
  const launchDeleteModal = () => {
    setModal(true);
  };
  const onDismiss = () => {
    setModal(false);
  };
  const onDelete = () => {
    deleteMutation({
      variables: {
        id: transactionId,
      },
    }).catch(() => {});
  };
  const save = (input: FormSchema) => {
    mutation({
      update,
      variables: {
        input,
      },
    }).catch(() => {});
  };

  return (
    <Connected error={error || mutationError} loading={loading}>
      {data?.getTransaction && data?.getSettings && data?.getClients && (
        <>
          <PageTitle
            title={t('view-transaction.title')}
            subTitle={t('view-transaction.sub-title')}
          />

          <Row>
            <Col>
              <TransactionForm
                attachment={attachment}
                attachmentView={
                  <ViewAttachment
                    id={companyId}
                    path={attachment}
                    onDelete={setAttachment}
                  />
                }
                backTo={backTo(companyId, data.getTransaction.status)}
                categories={data.getSettings.categories.map(
                  ({ name, vatRate }) => ({
                    name,
                    value: vatRate.toFixed(2),
                  }),
                )}
                clients={data.getClients.items.map(({ name }) => ({
                  name,
                  value: name,
                }))}
                companyId={companyId}
                initialValues={data.getTransaction}
                loading={mutationLoading}
                purchases={data.getTypeahead?.purchases}
                sales={data.getTypeahead?.sales}
                suppliers={data.getTypeahead?.suppliers}
                uploader={
                  <UploadAttachment
                    id={companyId}
                    name="attachment"
                    onUpload={setAttachment}
                    transactionId={transactionId}
                  />
                }
                vat={data.getSettings.vat.pay}
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
                {t('view-transaction.delete-transaction')}
              </Button>
            </Col>
          </Row>

          <DeleteItem
            title={t('delete-transaction.title')}
            warning={t('delete-transaction.warning')}
            display={modal}
            loading={deleteLoading}
            name={data.getTransaction.name}
            onDelete={onDelete}
            onDismiss={onDismiss}
          />
        </>
      )}
    </Connected>
  );
}

export default ViewTransaction;
