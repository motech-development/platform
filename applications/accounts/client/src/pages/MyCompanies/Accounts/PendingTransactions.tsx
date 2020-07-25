import { useMutation, useQuery } from '@apollo/react-hooks';
import {
  Button,
  Col,
  Currency,
  DataTable,
  LinkButton,
  PageTitle,
  Row,
  TableCell,
  Typography,
  useToast,
} from '@motech-development/breeze-ui';
import React, { FC, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';
import DeleteItem from '../../../components/DeleteItem';
import NoTransactions from '../../../components/NoTransactions';
import Scheduled from '../../../components/Scheduled';
import TransactionArrow from '../../../components/TransactionArrow';
import TransactionDetailsCell from '../../../components/TransactionDetailsCell';
import WarningText from '../../../components/WarningText';
import DELETE_TRANSACTION, {
  IDeleteTransactionInput,
  IDeleteTransactionOutput,
  updateCache,
} from '../../../graphql/transaction/DELETE_TRANSACTION';
import GET_TRANSACTIONS, {
  IGetTransactionsInput,
  IGetTransactionsOutput,
} from '../../../graphql/transaction/GET_TRANSACTIONS';

interface IPendingTransactionParams {
  companyId: string;
}

const PendingTransaction: FC = () => {
  const [transaction, setTransaction] = useState({
    id: '',
    name: '',
  });
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
  const launchDeleteModal = (id: string, name: string) => {
    setTransaction({
      id,
      name,
    });
  };
  const onDismiss = () => {
    setTransaction({
      id: '',
      name: '',
    });
  };
  const onDelete = async (id: string) => {
    await deleteMutation({
      update: updateCache,
      variables: {
        id,
      },
    });
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
                row={({
                  amount,
                  attachment,
                  date,
                  description,
                  id,
                  name,
                  scheduled,
                }) => (
                  <>
                    <TransactionArrow value={amount} />

                    <TransactionDetailsCell>
                      <WarningText
                        id={id}
                        component="p"
                        margin="none"
                        message={t(
                          'pending-transactions.transactions.no-attachment',
                        )}
                        placement="right"
                        show={!attachment}
                        variant="h6"
                      >
                        {name}
                      </WarningText>

                      <Typography
                        truncate
                        component="p"
                        variant="p"
                        margin="none"
                      >
                        {description}
                      </Typography>
                    </TransactionDetailsCell>

                    <TableCell>
                      <Scheduled
                        id={id}
                        message={t(
                          'pending-transactions.transactions.scheduled',
                        )}
                        placement="right"
                        show={scheduled}
                        value={date}
                      />
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
                        onClick={() => launchDeleteModal(id, name)}
                      >
                        {t('pending-transactions.transactions.delete')}
                      </Button>
                    </TableCell>
                  </>
                )}
                noResults={<NoTransactions />}
              />
            </Col>

            <Col>
              <Row>
                <Col xs={12} md={4} mdOffset={5} lg={3} lgOffset={7}>
                  <LinkButton
                    block
                    to={`/my-companies/accounts/${companyId}/record-transaction`}
                    size="lg"
                  >
                    {t('pending-transactions.record-transaction')}
                  </LinkButton>
                </Col>
                <Col xs={12} md={4} lg={3}>
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
            </Col>
          </Row>

          <DeleteItem
            title={t('delete-transaction.title')}
            warning={t('delete-transaction.warning')}
            display={!!transaction.id}
            loading={deleteLoading}
            name={transaction.name}
            onDelete={() => onDelete(transaction.id)}
            onDismiss={onDismiss}
          />
        </>
      )}
    </Connected>
  );
};

export default memo(PendingTransaction);
