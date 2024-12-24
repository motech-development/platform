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
import { Decimal } from 'decimal.js';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Currency from './Currency';
import DeleteItem from './DeleteItem';
import NoTransactions from './NoTransactions';
import TransactionArrow from './TransactionArrow';
import TransactionDetailsCell from './TransactionDetailsCell';
import WarningText from './WarningText';

export interface ITransactionsListProps {
  companyId: string;
  currency: string;
  loading: boolean;
  transactions: {
    amount: number;
    attachment?: string | null;
    date: string;
    description: string;
    id: string;
    name: string;
  }[];
  onDelete: (id: string) => void;
}

interface IGroupedTransactions {
  transactions: {
    amount: number;
    date: string;
    items: {
      amount: number;
      attachment?: string | null;
      description: string;
      id: string;
      name: string;
    }[];
  }[];
}

function TransactionsList({
  companyId,
  currency,
  loading,
  onDelete,
  transactions,
}: ITransactionsListProps) {
  const [transaction, setTransaction] = useState({
    id: '',
    name: '',
  });
  const { t } = useTranslation('accounts');
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

  useEffect(onDismiss, [transactions]);

  if (transactions.length === 0) {
    return <NoTransactions />;
  }

  return (
    <>
      <Table>
        {transactions
          .reduce<IGroupedTransactions['transactions']>((aggregate, item) => {
            const today = aggregate.find(({ date }) => date === item.date);

            if (today) {
              return aggregate.map((group) =>
                group.date === item.date
                  ? {
                      ...group,
                      amount: new Decimal(group.amount)
                        .add(item.amount)
                        .toNumber(),
                      items: [
                        ...group.items,
                        {
                          ...item,
                        },
                      ],
                    }
                  : group,
              );
            }

            return [
              ...aggregate,
              {
                amount: item.amount,
                date: item.date,
                items: [
                  {
                    ...item,
                  },
                ],
              },
            ];
          }, [])
          .map(({ amount, date, items }) => (
            <TableBody key={date}>
              <TableRow colour="primary">
                <TableCell as="th" align="left" colSpan={2}>
                  <DateTime value={date} format="EEEE, dd MMMM" />
                </TableCell>
                <TableCell as="th" align="right">
                  <Currency currency={currency} value={amount} />
                </TableCell>
                <TableCell as="th" align="left">
                  {t('transactions-list.actions')}
                </TableCell>
              </TableRow>

              {items.map((item) => (
                <TableRow key={item.id}>
                  <TransactionArrow value={item.amount} />

                  <TransactionDetailsCell>
                    <WarningText
                      id={item.id}
                      component="p"
                      margin="none"
                      message={t('transactions-list.no-attachment')}
                      placement="right"
                      show={!item.attachment}
                      variant="h6"
                    >
                      {item.name}
                    </WarningText>

                    <Typography
                      truncate
                      component="p"
                      variant="p"
                      margin="none"
                    >
                      {item.description}
                    </Typography>
                  </TransactionDetailsCell>

                  <TableCell align="right">
                    <Currency currency={currency} value={item.amount} />
                  </TableCell>

                  <TableCell>
                    <LinkButton
                      data-testid={`View ${item.name}`}
                      to={`/my-companies/accounts/${companyId}/view-transaction/${item.id}`}
                      size="sm"
                    >
                      {t('transactions-list.view')}
                    </LinkButton>{' '}
                    <Button
                      data-testid={`Delete ${item.name}`}
                      colour="danger"
                      size="sm"
                      onClick={() => launchDeleteModal(item.id, item.name)}
                    >
                      {t('transactions-list.delete')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ))}
      </Table>

      <DeleteItem
        title={t('delete-transaction.title')}
        warning={t('delete-transaction.warning')}
        display={!!transaction.id}
        loading={loading}
        name={transaction.name}
        onDelete={() => onDelete(transaction.id)}
        onDismiss={onDismiss}
      />
    </>
  );
}

export default TransactionsList;
