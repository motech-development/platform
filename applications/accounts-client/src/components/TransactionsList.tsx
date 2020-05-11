import {
  Button,
  DateTime,
  LinkButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@motech-development/breeze-ui';
import React, { FC, Fragment, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Currency from './Currency';
import DeleteItem from './DeleteItem';
import NoTransactions from './NoTransactions';
import TransactionArrow from './TransactionArrow';

export interface ITransactionsListProps {
  companyId: string;
  loading: boolean;
  transactions: {
    balance: number;
    currency: string;
    date: string;
    items: {
      amount: number;
      description: string;
      id: string;
      name: string;
    }[];
  }[];
  onDelete(id: string): void;
}

const TransactionsList: FC<ITransactionsListProps> = ({
  companyId,
  loading,
  onDelete,
  transactions,
}) => {
  const [transactionId, setTransactionId] = useState('');
  const { t } = useTranslation('accounts');
  const launchDeleteModal = (value: string) => {
    setTransactionId(value);
  };
  const onDismiss = () => {
    setTransactionId('');
  };

  if (transactions.length === 0) {
    return <NoTransactions />;
  }

  return (
    <Table>
      {transactions.map(({ balance, currency, date, items }) => (
        <TableBody key={date}>
          <TableRow colour="primary">
            <TableCell as="th" colSpan={2}>
              <DateTime value={date} format="dddd, DD MMMM" />
            </TableCell>
            <TableCell as="th" align="right">
              <Currency currency={currency} value={balance} />
            </TableCell>
            <TableCell as="th">{t('transactions-list.actions')}</TableCell>
          </TableRow>

          {items.map(item => (
            <Fragment key={item.id}>
              <TableRow>
                <TableCell align="center">
                  <TransactionArrow value={item.amount} />
                </TableCell>

                <TableCell>
                  <Typography component="p" variant="h6">
                    {item.name}
                  </Typography>

                  <Typography component="p" variant="p" margin="none">
                    {item.description}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Currency currency={currency} value={item.amount} />
                </TableCell>

                <TableCell>
                  <LinkButton
                    to={`/my-companies/accounts/${companyId}/view-transaction/${item.id}`}
                    size="sm"
                  >
                    {t('transactions-list.view')}
                  </LinkButton>{' '}
                  <Button
                    colour="danger"
                    size="sm"
                    onClick={() => launchDeleteModal(item.id)}
                  >
                    {t('transactions-list.delete')}
                  </Button>
                </TableCell>
              </TableRow>

              <DeleteItem
                title={t('delete-transaction.title')}
                warning={t('delete-transaction.warning')}
                display={transactionId === item.id}
                loading={loading}
                name={item.name}
                onDelete={() => onDelete(item.id)}
                onDismiss={onDismiss}
              />
            </Fragment>
          ))}
        </TableBody>
      ))}
    </Table>
  );
};

export default memo(TransactionsList);
