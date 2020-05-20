import { useMutation, useQuery } from '@apollo/react-hooks';
import {
  Button,
  Col,
  PageTitle,
  Row,
  useToast,
} from '@motech-development/breeze-ui';
import { gql } from 'apollo-boost';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';
import DeleteItem from '../../../components/DeleteItem';
import TransactionForm, {
  FormSchema,
} from '../../../components/TransactionForm';
import GET_BALANCE from '../../../graphql/balance/GET_BALANCE';
import DELETE_TRANSACTION, {
  IDeleteTransactionInput,
  IDeleteTransactionOutput,
  updateCache,
} from '../../../graphql/transaction/DELETE_TRANSACTION';
import UPDATE_TRANSACTION, {
  IUpdateTransactionInput,
  IUpdateTransactionOutput,
} from '../../../graphql/transaction/UPDATE_TRANSACTION';
import withLayout from '../../../hoc/withLayout';
import DeleteAttachment from './DeleteAttachment';
import UploadAttachment from './UploadAttachment';

interface IViewTransactionInput {
  companyId: string;
  transactionId: string;
}

interface IViewTransactionOutput {
  getClients: {
    items: {
      name: string;
    }[];
  };
  getSettings: {
    categories: {
      name: string;
      vatRate: number;
    }[];
    id: string;
    vat: {
      pay: number;
    };
  };
  getTransaction: {
    amount: number;
    attachment: string;
    category: string;
    companyId: string;
    date: string;
    description: string;
    id: string;
    name: string;
    status: string;
    vat: number;
  };
}

export const VIEW_TRANSACTION = gql`
  query ViewTransaction($companyId: ID!, $transactionId: ID!) {
    getClients(companyId: $companyId) {
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
      status
      vat
    }
  }
`;

interface IViewTransactionParams {
  companyId: string;
  transactionId: string;
}

const ViewTransaction: FC = () => {
  const history = useHistory();
  const { companyId, transactionId } = useParams<IViewTransactionParams>();
  const [attachment, setAttachment] = useState('');
  const [modal, setModal] = useState(false);
  const { t } = useTranslation('accounts');
  const { add } = useToast();
  const backTo = (id: string) => `/my-companies/accounts/${id}`;
  const { data, error, loading } = useQuery<
    IViewTransactionOutput,
    IViewTransactionInput
  >(VIEW_TRANSACTION, {
    onCompleted: ({ getTransaction }) => {
      setAttachment(getTransaction.attachment || '');
    },
    variables: {
      companyId,
      transactionId,
    },
  });
  const [
    mutation,
    { error: mutationError, loading: mutationLoading },
  ] = useMutation<IUpdateTransactionOutput, IUpdateTransactionInput>(
    UPDATE_TRANSACTION,
    {
      awaitRefetchQueries: true,
      onCompleted: ({ updateTransaction }) => {
        add({
          colour: 'success',
          message: t('view-transaction.success'),
        });

        history.push(backTo(updateTransaction.companyId));
      },
      refetchQueries: () => [
        {
          query: GET_BALANCE,
          variables: {
            id: companyId,
          },
        },
      ],
    },
  );
  const [deleteMutation, { loading: deleteLoading }] = useMutation<
    IDeleteTransactionOutput,
    IDeleteTransactionInput
  >(DELETE_TRANSACTION, {
    awaitRefetchQueries: true,
    onCompleted: ({ deleteTransaction }) => {
      add({
        colour: 'success',
        message: t('delete-transaction.success'),
      });

      history.push(backTo(deleteTransaction.companyId));
    },
    onError: () => {
      add({
        colour: 'danger',
        message: t('delete-transaction.error'),
      });
    },
    refetchQueries: () => [
      {
        query: GET_BALANCE,
        variables: {
          id: companyId,
        },
      },
    ],
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
          id: transactionId,
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
    <Connected error={error || mutationError} loading={loading}>
      {data && (
        <>
          <PageTitle
            title={t('view-transaction.title')}
            subTitle={t('view-transaction.sub-title')}
          />

          <Row>
            <Col>
              <TransactionForm
                attachment={attachment}
                backTo={backTo(companyId)}
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
                deleteAttachment={
                  <DeleteAttachment
                    path={attachment}
                    onDelete={setAttachment}
                  />
                }
                initialValues={data.getTransaction}
                loading={mutationLoading}
                uploader={
                  <UploadAttachment
                    id={companyId}
                    name="attachment"
                    onUpload={setAttachment}
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
};

export default withLayout(ViewTransaction);
