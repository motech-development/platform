import { gql, MutationUpdaterFn } from '@apollo/client';
import GET_TRANSACTIONS, {
  IGetTransactionsInput,
  IGetTransactionsOutput,
} from './GET_TRANSACTIONS';

export interface IDeleteTransactionInput {
  id: string;
}

export interface IDeleteTransactionOutput {
  deleteTransaction: {
    companyId: string;
    id: string;
    status: string;
  };
}

export const updateCache: MutationUpdaterFn<IDeleteTransactionOutput> = (
  client,
  { data },
) => {
  if (data) {
    const { deleteTransaction } = data;

    try {
      const cache = client.readQuery<
        IGetTransactionsOutput,
        IGetTransactionsInput
      >({
        query: GET_TRANSACTIONS,
        variables: {
          companyId: deleteTransaction.companyId,
          status: deleteTransaction.status,
        },
      });

      if (cache) {
        const items = cache.getTransactions.items.filter(
          ({ id }) => deleteTransaction.id !== id,
        );

        client.writeQuery<IGetTransactionsOutput, IGetTransactionsInput>({
          data: {
            getBalance: {
              ...cache.getBalance,
            },
            getTransactions: {
              ...cache.getTransactions,
              items,
            },
          },
          query: GET_TRANSACTIONS,
          variables: {
            companyId: deleteTransaction.companyId,
            status: deleteTransaction.status,
          },
        });
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}
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
