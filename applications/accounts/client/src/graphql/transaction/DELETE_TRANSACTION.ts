import { gql, MutationUpdaterFn, Reference } from '@apollo/client';

export interface IDeleteTransactionInput {
  id: string;
}

export interface IDeleteTransactionOutput {
  deleteTransaction?: {
    companyId: string;
    id: string;
    status: string;
  };
}

interface ITransaction {
  items: Reference[];
}

export const updateCache: MutationUpdaterFn<IDeleteTransactionOutput> = (
  cache,
  { data },
) => {
  if (data?.deleteTransaction) {
    const { deleteTransaction } = data;

    cache.modify({
      fields: {
        items: (refs: Reference[], { readField }) =>
          refs.filter((ref) => readField('id', ref) !== deleteTransaction.id),
      },
      id: cache.identify({
        __typename: 'Transactions',
        id: deleteTransaction.companyId,
        status: deleteTransaction.status,
      }),
    });

    cache.modify({
      fields: {
        transactions: (transactions: ITransaction[], { readField }) =>
          transactions.filter((transaction) =>
            transaction.items.every(
              (item) => readField('id', item) !== deleteTransaction.id,
            ),
          ),
      },
      id: cache.identify({
        __typename: 'Balance',
        id: deleteTransaction.companyId,
      }),
    });
  }
};

const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id) {
      companyId
      id
      status
    }
  }
`;

export default DELETE_TRANSACTION;
