import { gql, MutationUpdaterFn } from '@apollo/client';
import GET_TYPEAHEAD, {
  IGetTypeaheadInput,
  IGetTypeaheadOutput,
} from '../typeahead/GET_TYPEAHEAD';
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
    scheduled: boolean;
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
    scheduled: boolean;
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
          ...cache.getTransactions.items.filter(
            ({ id }) => id !== updateTransaction.id,
          ),
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

    try {
      const cache = client.readQuery<IGetTypeaheadOutput, IGetTypeaheadInput>({
        query: GET_TYPEAHEAD,
        variables: {
          id: updateTransaction.companyId,
        },
      });

      if (cache) {
        if (updateTransaction.category === 'Sales') {
          const descriptions = new Set([
            ...(cache.getTypeahead.sales === null
              ? []
              : cache.getTypeahead.sales),
            updateTransaction.description,
          ]);

          cache.getTypeahead.sales = [...descriptions];
        } else {
          const suppliers = new Set([
            ...(cache.getTypeahead.suppliers === null
              ? []
              : cache.getTypeahead.suppliers),
            updateTransaction.name,
          ]);
          const descriptions = new Set([
            ...(cache.getTypeahead.purchases === null
              ? []
              : cache.getTypeahead.purchases),
            updateTransaction.description,
          ]);

          cache.getTypeahead.purchases = [...descriptions];
          cache.getTypeahead.suppliers = [...suppliers];
        }

        client.writeQuery<IGetTypeaheadOutput, IGetTypeaheadInput>({
          data: cache,
          query: GET_TYPEAHEAD,
          variables: {
            id: updateTransaction.companyId,
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
      scheduled
      status
      vat
    }
  }
`;

export default UPDATE_TRANSACTION;
