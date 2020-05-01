import {
  Button,
  Card,
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
import TransactionArrow from './TransactionArrow';

export interface ITransactionsListProps {
  companyId: string;
  transactions: {
    balance: number;
    currency: string;
    date: string;
    items: {
      amount: number;
      date: string;
      description: string;
      id: string;
      name: string;
    }[];
  }[];
  onDelete(id: string, name: string): void;
}

const TransactionsList: FC<ITransactionsListProps> = ({
  companyId,
  onDelete,
  transactions,
}) => {
  const { t } = useTranslation('accounts');
  // TODO: Unified edit screen
  const action = (amount: number) => {
    if (amount > 0) {
      return 'view-sale';
    }

    return 'view-purchase';
  };

  if (transactions.length === 0) {
    return (
      <Card padding="lg">
        <Typography rule align="center" component="h2" variant="h2" margin="lg">
          {t('transactions-list.no-transactions.title')}
        </Typography>

        <Typography align="center" component="h3" variant="lead" margin="none">
          {t('transactions-list.no-transactions.description')}
        </Typography>
      </Card>
    );
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
                  to={`/my-companies/accounts/${companyId}/${action(
                    item.amount,
                  )}/${item.id}`}
                  size="sm"
                >
                  {t('transactions-list.view')}
                </LinkButton>{' '}
                <Button
                  colour="danger"
                  size="sm"
                  onClick={() => onDelete(item.id, item.name)}
                >
                  {t('transactions-list.delete')}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      ))}
    </Table>
  );
};

export default memo(TransactionsList);
