import { gql, MutationUpdaterFn } from 'apollo-boost';
import GET_TRANSACTIONS, {
  IGetTransactionsInput,
  IGetTransactionsOutput,
} from './GET_TRANSACTIONS';

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
    status: string;
    vat: number;
  };
}

export interface IUpdateTransactionOutput {
  updateTransaction: {
    amount: number;
    attachment: string;
    category: string;
    companyId: string;
    date: string;
    description: string;
    id: string;
    name: string;
    status: string;
    vat: number;
  };
}

export const updateCache: MutationUpdaterFn<IUpdateTransactionOutput> = (
  client,
  { data },
) => {
  if (data) {
    const { updateTransaction } = data;
    const otherStatus =
      updateTransaction.status === 'confirmed' ? 'pending' : 'confirmed';

    try {
      const cache = client.readQuery<
        IGetTransactionsOutput,
        IGetTransactionsInput
      >({
        query: GET_TRANSACTIONS,
        variables: {
          companyId: updateTransaction.companyId,
          status: updateTransaction.status,
        },
      });

      if (cache) {
        cache.getTransactions.items = [
          ...cache.getTransactions.items,
          updateTransaction,
        ].sort((a, b) => a.date.localeCompare(b.date));

        client.writeQuery<IGetTransactionsOutput, IGetTransactionsInput>({
          data: cache,
          query: GET_TRANSACTIONS,
          variables: {
            companyId: updateTransaction.companyId,
            status: updateTransaction.status,
          },
        });
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}

    try {
      const cache = client.readQuery<
        IGetTransactionsOutput,
        IGetTransactionsInput
      >({
        query: GET_TRANSACTIONS,
        variables: {
          companyId: updateTransaction.companyId,
          status: otherStatus,
        },
      });

      if (cache) {
        cache.getTransactions.items = cache.getTransactions.items.filter(
          ({ id }) => updateTransaction.id !== id,
        );

        client.writeQuery<IGetTransactionsOutput, IGetTransactionsInput>({
          data: cache,
          query: GET_TRANSACTIONS,
          variables: {
            companyId: updateTransaction.companyId,
            status: otherStatus,
          },
        });
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}
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
      status
      vat
    }
  }
`;

export default UPDATE_TRANSACTION;
