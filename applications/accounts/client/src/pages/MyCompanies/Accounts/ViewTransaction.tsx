import { gql, useMutation, useQuery } from '@apollo/client';
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
import DELETE_TRANSACTION, {
  IDeleteTransactionInput,
  IDeleteTransactionOutput,
} from '../../../graphql/transaction/DELETE_TRANSACTION';
import UPDATE_TRANSACTION, {
  IUpdateTransactionInput,
  IUpdateTransactionOutput,
  updateCache as updateTransactionCache,
} from '../../../graphql/transaction/UPDATE_TRANSACTION';
import invariant from '../../../utils/invariant';
import UploadAttachment from './shared/UploadAttachment';
import ViewAttachment from './shared/ViewAttachment';

interface IViewTransactionInput {
  companyId: string;
  transactionId: string;
}

interface IViewTransactionOutput {
  getClients?: {
    items: {
      name: string;
    }[];
  };
  getSettings?: {
    categories: {
      name: string;
      vatRate: number;
    }[];
    id: string;
    vat: {
      pay: number;
    };
  };
  getTransaction?: {
    amount: number;
    attachment: string;
    category: string;
    companyId: string;
    date: string;
    description: string;
    id: string;
    name: string;
    refund: boolean;
    scheduled: boolean;
    status: string;
    vat: number;
  };
  getTypeahead?: {
    purchases: string[];
    sales: string[];
    suppliers: string[];
  };
}

export const VIEW_TRANSACTION = gql`
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
`;

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

  const { data, error, loading } = useQuery<
    IViewTransactionOutput,
    IViewTransactionInput
  >(VIEW_TRANSACTION, {
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
    useMutation<IUpdateTransactionOutput, IUpdateTransactionInput>(
      UPDATE_TRANSACTION,
      {
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
      },
    );
  const [deleteMutation, { loading: deleteLoading }] = useMutation<
    IDeleteTransactionOutput,
    IDeleteTransactionInput
  >(DELETE_TRANSACTION, {
    onCompleted: ({ deleteTransaction }) => {
      if (deleteTransaction) {
        add({
          colour: 'success',
          message: t('delete-transaction.success'),
        });

        navigate(backTo(deleteTransaction.companyId, deleteTransaction.status));
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
  });
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
      update: updateTransactionCache,
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
