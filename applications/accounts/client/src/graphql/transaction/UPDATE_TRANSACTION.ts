import { gql, MutationUpdaterFn, Reference } from '@apollo/client';

export interface IUpdateTransactionInput {
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

export interface IUpdateTransactionOutput {
  updateTransaction?: {
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

export const updateCache: MutationUpdaterFn<IUpdateTransactionOutput> = (
  cache,
  { data },
) => {
  if (data?.updateTransaction) {
    const { updateTransaction } = data;
    const otherStatus =
      updateTransaction.status === 'confirmed' ? 'pending' : 'confirmed';

    cache.modify({
      fields: {
        items: (refs: Reference[], { readField }) => {
          if (refs.some(ref => readField('id', ref) === updateTransaction.id)) {
            return refs;
          }

          const newRef = cache.writeFragment({
            data: updateTransaction,
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
        id: updateTransaction.companyId,
        status: updateTransaction.status,
      }),
    });

    cache.modify({
      fields: {
        items: (refs: Reference[], { readField }) =>
          refs.filter(ref => readField('id', ref) !== updateTransaction.id),
      },
      id: cache.identify({
        __typename: 'Transactions',
        id: updateTransaction.companyId,
        status: otherStatus,
      }),
    });

    cache.modify({
      fields: {
        purchases: (items: string[] | null) => {
          const descriptions = items || [];
          const unique = !descriptions.some(
            desciption => desciption === updateTransaction.description,
          );

          if (updateTransaction.category !== 'Sales' && unique) {
            return [
              ...descriptions,
              updateTransaction.description,
            ].sort((a, b) => a.localeCompare(b));
          }

          return descriptions;
        },
        sales: (items: string[] | null) => {
          const descriptions = items || [];
          const unique = !descriptions.some(
            desciption => desciption === updateTransaction.description,
          );

          if (updateTransaction.category === 'Sales' && unique) {
            return [
              ...descriptions,
              updateTransaction.description,
            ].sort((a, b) => a.localeCompare(b));
          }

          return descriptions;
        },
        suppliers: (items: string[] | null) => {
          const suppliers = items || [];
          const unique = !suppliers.some(
            supplier => supplier === updateTransaction.name,
          );

          if (updateTransaction.category !== 'Sales' && unique) {
            return [...suppliers, updateTransaction.name].sort((a, b) =>
              a.localeCompare(b),
            );
          }

          return suppliers;
        },
      },
      id: cache.identify({
        __typename: 'Typeahead',
        id: updateTransaction.companyId,
      }),
    });
  }
};

const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($input: TransactionInput!) {
    updateTransaction(input: $input) {
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

export default UPDATE_TRANSACTION;
