import { useMutation, useQuery } from '@apollo/react-hooks';
import {
  Button,
  Col,
  DataTable,
  DateTime,
  LinkButton,
  PageTitle,
  Row,
  TableCell,
  Typography,
  useToast,
} from '@motech-development/breeze-ui';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';
import Currency from '../../../components/Currency';
import DeleteItem from '../../../components/DeleteItem';
import NoTransactions from '../../../components/NoTransactions';
import TransactionArrow from '../../../components/TransactionArrow';
import DELETE_TRANSACTION, {
  IDeleteTransactionInput,
  IDeleteTransactionOutput,
  updateCache,
} from '../../../graphql/transaction/DELETE_TRANSACTION';
import GET_TRANSACTIONS, {
  IGetTransactionsInput,
  IGetTransactionsOutput,
} from '../../../graphql/transaction/GET_TRANSACTIONS';
import withLayout from '../../../hoc/withLayout';

interface IPendingTransactionParams {
  companyId: string;
}

const PendingTransaction: FC = () => {
  const [transactionId, setTransactionId] = useState('');
  const { t } = useTranslation('accounts');
  const { companyId } = useParams<IPendingTransactionParams>();
  const { add } = useToast();
  const { data, error, loading } = useQuery<
    IGetTransactionsOutput,
    IGetTransactionsInput
  >(GET_TRANSACTIONS, {
    variables: {
      companyId,
      status: 'pending',
    },
  });
  const [deleteMutation, { loading: deleteLoading }] = useMutation<
    IDeleteTransactionOutput,
    IDeleteTransactionInput
  >(DELETE_TRANSACTION, {
    onCompleted: () => {
      add({
        colour: 'success',
        message: t('delete-transaction.success'),
      });

      onDismiss();
    },
    onError: () => {
      add({
        colour: 'danger',
        message: t('delete-transaction.error'),
      });
    },
  });
  const launchDeleteModal = (value: string) => {
    setTransactionId(value);
  };
  const onDismiss = () => {
    setTransactionId('');
  };
  const onDelete = (id: string) => {
    (async () => {
      await deleteMutation({
        update: updateCache,
        variables: {
          id,
        },
      });
    })();
  };

  return (
    <Connected error={error} loading={loading}>
      {data && (
        <>
          <PageTitle
            title={t('pending-transactions.title')}
            subTitle={t('pending-transactions.sub-title')}
          />

          <Row>
            <Col>
              <DataTable
                items={data.getTransactions.items}
                header={
                  <>
                    <TableCell as="th" colSpan={2}>
                      {t('pending-transactions.transactions.name')}
                    </TableCell>
                    <TableCell as="th">
                      {t('pending-transactions.transactions.date')}
                    </TableCell>
                    <TableCell as="th" align="right">
                      {t('pending-transactions.transactions.amount')}
                    </TableCell>
                    <TableCell as="th">
                      {t('pending-transactions.transactions.actions')}
                    </TableCell>
                  </>
                }
                row={({ amount, date, description, id, name }) => (
                  <>
                    <TableCell align="center">
                      <TransactionArrow value={amount} />
                    </TableCell>

                    <TableCell>
                      <Typography component="p" variant="h6">
                        {name}
                      </Typography>

                      <Typography component="p" variant="p" margin="none">
                        {description}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <DateTime value={date} />
                    </TableCell>

                    <TableCell align="right">
                      <Currency
                        currency={data.getBalance.currency}
                        value={amount}
                      />
                    </TableCell>

                    <TableCell>
                      <LinkButton
                        to={`/my-companies/accounts/${companyId}/view-transaction/${id}`}
                        size="sm"
                      >
                        {t('pending-transactions.transactions.view')}
                      </LinkButton>{' '}
                      <Button
                        colour="danger"
                        size="sm"
                        onClick={() => launchDeleteModal(id)}
                      >
                        {t('pending-transactions.transactions.delete')}
                      </Button>
                    </TableCell>

                    <DeleteItem
                      title={t('delete-transaction.title')}
                      warning={t('delete-transaction.warning')}
                      display={transactionId === id}
                      loading={deleteLoading}
                      name={name}
                      onDelete={() => onDelete(id)}
                      onDismiss={onDismiss}
                    />
                  </>
                )}
                noResults={<NoTransactions />}
              />
            </Col>

            <Col xs={12} md={3}>
              <LinkButton
                block
                to={`/my-companies/accounts/${companyId}`}
                colour="secondary"
                size="lg"
              >
                {t('pending-transactions.go-back')}
              </LinkButton>
            </Col>
          </Row>
        </>
      )}
    </Connected>
  );
};

export default withLayout(PendingTransaction);
