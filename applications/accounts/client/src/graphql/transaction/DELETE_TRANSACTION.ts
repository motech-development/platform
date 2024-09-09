import {
  ApolloCache,
  gql,
  MutationUpdaterFunction,
  Reference,
} from '@apollo/client';

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

export const updateCache: MutationUpdaterFunction<
  IDeleteTransactionOutput,
  IDeleteTransactionInput,
  unknown,
  ApolloCache<unknown>
> = (cache, { data }) => {
  if (data?.deleteTransaction) {
    const { deleteTransaction } = data;

    cache.modify({
      fields: {
        items: (refs: readonly Reference[], { readField }) =>
          refs.filter((ref) => readField('id', ref) !== deleteTransaction.id),
      },
      id: cache.identify({
        __typename: 'Transactions',
        id: deleteTransaction.companyId,
        status: deleteTransaction.status,
      }),
    });

    cache.modify<{
      transactions: ITransaction[];
    }>({
      fields: {
        transactions: (transactions, { readField }) =>
          (transactions as ITransaction[]).filter((transaction) =>
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
