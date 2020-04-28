import { Decimal } from 'decimal.js';
import moment from 'moment';

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

const transformBalance = (
  balanceItem?: IBalanceItem,
  transactionItems?: ITransactionItem[],
) => {
  if (!balanceItem) {
    throw new Error('Balance not found');
  }

  const { balance, currency, id, items, vat } = balanceItem;
  const transactions = Object.keys(items)
    .map(key => ({
      balance: items[key] as number,
      currency,
      date: key,
    }))
    .filter(transaction => transaction.balance !== 0)
    .sort((a, b) => a.date.localeCompare(b.date))
    .reduce<IBalance[]>((acc, current, i) => {
      const update = {
        ...current,
        balance:
          i > 0
            ? new Decimal(acc[i - 1].balance).add(current.balance).toNumber()
            : current.balance,
        items: transactionItems
          ? transactionItems.filter(({ date }) =>
              moment(date)
                .startOf('day')
                .isSame(moment(current.date).startOf('day')),
            )
          : [],
      };

      acc.push(update);

      return acc;
    }, [])
    .sort((a, b) => -a.date.localeCompare(b.date));

  return {
    balance,
    currency,
    id,
    transactions,
    vat,
  };
};

export default transformBalance;
