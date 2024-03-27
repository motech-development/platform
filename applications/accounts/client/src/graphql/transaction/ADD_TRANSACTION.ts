import { gql, MutationUpdaterFn } from '@apollo/client';
import { findUnique, setItems, spread } from './utils';

export interface IAddTransactionInput {
  input: {
    amount: number;
    attachment: string;
    category: string;
    companyId: string;
    date: string;
    description: string;
    id: string;
    name: string;
    refund: boolean;
    scheduled: boolean;
    status: string;
    vat: number;
  };
}

export interface IAddTransactionOutput {
  addTransaction?: {
    amount: number;
    attachment: string;
    category: string;
    companyId: string;
    date: string;
    description: string;
    id: string;
    name: string;
    refund: boolean;
    scheduled: boolean;
    status: string;
    vat: number;
  };
}

export const updateCache: MutationUpdaterFn<IAddTransactionOutput> = (
  cache,
  { data },
) => {
  if (data?.addTransaction) {
    const { addTransaction } = data;

    cache.modify({
      fields: {
        purchases: (items: string[] | null) => {
          const descriptions = setItems(items);
          const unique = !descriptions.some(
            findUnique(addTransaction, 'description'),
          );

          if (spread(addTransaction.category !== 'Sales', unique)) {
            return [...descriptions, addTransaction.description].sort((a, b) =>
              a.localeCompare(b),
            );
          }

          return descriptions;
        },
        sales: (items: string[] | null) => {
          const descriptions = setItems(items);
          const unique = !descriptions.some(
            findUnique(addTransaction, 'description'),
          );

          if (spread(addTransaction.category === 'Sales', unique)) {
            return [...descriptions, addTransaction.description].sort((a, b) =>
              a.localeCompare(b),
            );
          }

          return descriptions;
        },
        suppliers: (items: string[] | null) => {
          const suppliers = setItems(items);
          const unique = !suppliers.some(findUnique(addTransaction, 'name'));

          if (spread(addTransaction.category !== 'Sales', unique)) {
            return [...suppliers, addTransaction.name].sort((a, b) =>
              a.localeCompare(b),
            );
          }

          return suppliers;
        },
      },
      id: cache.identify({
        __typename: 'Typeahead',
        id: addTransaction.companyId,
      }),
    });
  }
};

const ADD_TRANSACTION = gql`
  mutation AddTransaction($input: TransactionInput!) {
    addTransaction(input: $input) {
      amount
      attachment
      category
      companyId
      date
      description
      id
      name
      refund
      scheduled
      status
      vat
    }
  }
`;

export default ADD_TRANSACTION;
