import {
  DateTime,
  LinkButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@motech-development/breeze-ui';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import Currency from './Currency';
import NoTransactions from './NoTransactions';
import TransactionArrow from './TransactionArrow';

export interface ITransactionsListProps {
  companyId: string;
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
}

const TransactionsList: FC<ITransactionsListProps> = ({
  companyId,
  transactions,
}) => {
  const { t } = useTranslation('accounts');

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
            <TableRow key={item.id}>
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
                </LinkButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      ))}
    </Table>
  );
};

export default memo(TransactionsList);
