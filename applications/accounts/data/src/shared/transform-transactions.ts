import { Decimal } from 'decimal.js';
import { DateTime } from 'luxon';

interface IBalance {
  balance: number;
  currency: string;
  date: string;
}

export interface IBalanceItem {
  balance: number;
  currency: string;
  id: string;
  items: {
    [name: string]: number;
  };
  openingBalance: number;
  owner: string;
  vat: {
    owed: number;
    paid: number;
  };
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
  balanceItem?: IBalanceItem,
  transactionItems?: ITransactionItem[],
): IBalance[] => {
  if (!balanceItem) {
    throw new Error('Balance not found');
  }

  if (!Array.isArray(transactionItems)) {
    throw new Error('No transactions returned');
  }

  const { currency, items, openingBalance } = balanceItem;
  const transactions = Object.keys(items)
    .filter((key) => items[key] !== 0)
    .map((key, i) => ({
      balance:
        i === 0
          ? new Decimal(items[key]).add(openingBalance).toNumber()
          : items[key],
      currency,
      date: key,
    }))
    .sort((a, b) => {
      const d1 = DateTime.fromISO(a.date);
      const d2 = DateTime.fromISO(b.date);

      return d1 > d2 ? 1 : -1;
    })
    .reduce<IBalance[]>((acc, current, i) => {
      const update = {
        ...current,
        balance:
          i > 0
            ? new Decimal(acc[i - 1].balance).add(current.balance).toNumber()
            : current.balance,
        items: transactionItems.filter(({ date }) => {
          const transactionDate = DateTime.fromISO(date);
          const currentDate = DateTime.fromISO(current.date);

          return transactionDate.hasSame(currentDate, 'day');
        }),
      };

      acc.push(update);

      return acc;
    }, [])
    .sort((a, b) => {
      const d1 = DateTime.fromISO(a.date);
      const d2 = DateTime.fromISO(b.date);

      return d1 > d2 ? -1 : 1;
    });

  return transactions;
};

export default transformTransactions;
