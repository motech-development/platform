import { useQuery } from '@apollo/react-hooks';
import {
  Col,
  DataTable,
  DateTime,
  LinkButton,
  PageTitle,
  Row,
  TableCell,
  Typography,
} from '@motech-development/breeze-ui';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';
import Currency from '../../../components/Currency';
import NoTransactions from '../../../components/NoTransactions';
import TransactionArrow from '../../../components/TransactionArrow';
import GET_TRANSACTIONS, {
  IGetTransactionsInput,
  IGetTransactionsOutput,
} from '../../../graphql/transaction/GET_TRANSACTIONS';
import withLayout from '../../../hoc/withLayout';

interface IPendingTransactionParams {
  companyId: string;
}

const PendingTransaction: FC = () => {
  const { t } = useTranslation('accounts');
  const { companyId } = useParams<IPendingTransactionParams>();
  const { data, error, loading } = useQuery<
    IGetTransactionsOutput,
    IGetTransactionsInput
  >(GET_TRANSACTIONS, {
    variables: {
      companyId,
      status: 'pending',
    },
  });

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
                      </LinkButton>
                    </TableCell>
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
