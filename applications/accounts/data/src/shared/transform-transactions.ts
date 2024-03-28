import logger from '@motech-development/node-logger';
import { Decimal } from 'decimal.js';
import { DateTime } from 'luxon';

export interface IBalance {
  __typename: string;
  balance: number;
  currency: string;
  id: string;
  items: {
    [name: string]: number;
  };
  openingBalance: number;
  owner: string;
  updatedAt: string;
  vat: {
    owed: number;
    paid: number;
  };
}

interface ITransactions {
  balance: number;
  currency: string;
  date: string;
  items: ITransactionItem[];
}

export interface ITransactionItem {
  amount: number;
  category: string;
  companyId: string;
  date: string;
  description: string;
  id: string;
  name: string;
  status: string;
  vat: number;
}

const transformTransactions = (
  balance?: IBalance,
  transactionItems?: ITransactionItem[],
): ITransactions[] => {
  if (!balance) {
    throw new Error('Balance not found');
  }

  if (!Array.isArray(transactionItems)) {
    throw new Error('No transactions returned');
  }

  logger.info('Transaction items', transactionItems);

  const { currency, items, openingBalance } = balance;

  logger.info('Items', {
    items,
  });

  const transactions = Object.keys(items)
    .map((key, i) => {
      logger.info('Map', {
        item: items[key],
        key,
      });

      return {
        balance:
          i === 0
            ? new Decimal(items[key]).add(openingBalance).toNumber()
            : items[key],
        currency,
        date: key,
      };
    })
    .sort((a, b) => {
      const d1 = DateTime.fromISO(a.date);
      const d2 = DateTime.fromISO(b.date);

      return d1 > d2 ? 1 : -1;
    })
    .reduce<ITransactions[]>((acc, current, i) => {
      logger.info('Filtered items', current);

      const update = {
        ...current,
        balance:
          i > 0
            ? new Decimal(acc[i - 1].balance).add(current.balance).toNumber()
            : current.balance,
        items: transactionItems
          .filter(({ date }) => {
            const transactionDate = DateTime.fromISO(date);
            const currentDate = DateTime.fromISO(current.date);

            return transactionDate.hasSame(currentDate, 'day');
          })
          .map((item) => ({
            attachment: '',
            refund: false,
            scheduled: false,
            ...item,
          })),
      };

      acc.push(update);

      return acc;
    }, [])
    .filter((transaction) => transaction.items.length !== 0)
    .sort((a, b) => {
      const d1 = DateTime.fromISO(a.date);
      const d2 = DateTime.fromISO(b.date);

      return d1 > d2 ? -1 : 1;
    });

  return transactions;
};

export default transformTransactions;
