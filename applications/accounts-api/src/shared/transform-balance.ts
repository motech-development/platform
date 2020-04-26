import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import moment from 'moment';

interface IBalance {
  balance: number;
  currency: string;
  date: string;
}

const transformBalance = (
  item: DocumentClient.AttributeMap | undefined,
  transactionItems: DocumentClient.ItemList | undefined,
) => {
  if (!item) {
    throw new Error('Balance not found');
  }

  const { balance, currency, id, items, vat } = item;
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
        balance: i > 0 ? acc[i - 1].balance + current.balance : current.balance,
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
