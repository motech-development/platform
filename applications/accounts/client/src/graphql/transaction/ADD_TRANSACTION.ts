import { gql, MutationUpdaterFn, Reference } from '@apollo/client';

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
          const descriptions = items || [];
          const unique = !descriptions.some(
            desciption => desciption === addTransaction.description,
          );

          if (addTransaction.category !== 'Sales' && unique) {
            return [...descriptions, addTransaction.description].sort((a, b) =>
              a.localeCompare(b),
            );
          }

          return descriptions;
        },
        sales: (items: string[] | null) => {
          const descriptions = items || [];
          const unique = !descriptions.some(
            desciption => desciption === addTransaction.description,
          );

          if (addTransaction.category === 'Sales' && unique) {
            return [...descriptions, addTransaction.description].sort((a, b) =>
              a.localeCompare(b),
            );
          }

          return descriptions;
        },
        suppliers: (items: string[] | null) => {
          const suppliers = items || [];
          const unique = !suppliers.some(
            supplier => supplier === addTransaction.name,
          );

          if (addTransaction.category !== 'Sales' && unique) {
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

    cache.modify({
      fields: {
        items: (refs: Reference[], { readField }) => {
          if (refs.some(ref => readField('id', ref) === addTransaction.id)) {
            return refs;
          }

          const newRef = cache.writeFragment({
            data: addTransaction,
            fragment: gql`
              fragment NewTransaction on Transaction {
                amount
                attachment
                date
                description
                id
                name
                scheduled
              }
            `,
          });
          return [...refs, newRef].sort((a, b) =>
            readField<string>('date', a)!.localeCompare(
              readField<string>('date', b)!,
            ),
          );
        },
      },
      id: cache.identify({
        __typename: 'Transactions',
        id: addTransaction.companyId,
        status: addTransaction.status,
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
      scheduled
      status
      vat
    }
  }
`;

export default ADD_TRANSACTION;
