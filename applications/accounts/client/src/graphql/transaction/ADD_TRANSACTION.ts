import { gql, MutationUpdaterFn } from 'apollo-boost';
import GET_TYPEAHEAD, {
  IGetTypeaheadInput,
  IGetTypeaheadOutput,
} from '../typeahead/GET_TYPEAHEAD';
import GET_TRANSACTIONS, {
  IGetTransactionsInput,
  IGetTransactionsOutput,
} from './GET_TRANSACTIONS';

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
    status: string;
    vat: number;
  };
}

export interface IAddTransactionOutput {
  addTransaction: {
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

export const updateCache: MutationUpdaterFn<IAddTransactionOutput> = (
  client,
  { data },
) => {
  if (data) {
    const { addTransaction } = data;

    try {
      const cache = client.readQuery<
        IGetTransactionsOutput,
        IGetTransactionsInput
      >({
        query: GET_TRANSACTIONS,
        variables: {
          companyId: addTransaction.companyId,
          status: addTransaction.status,
        },
      });

      if (cache) {
        cache.getTransactions.items = [
          ...cache.getTransactions.items,
          addTransaction,
        ].sort((a, b) => a.date.localeCompare(b.date));

        client.writeQuery<IGetTransactionsOutput, IGetTransactionsInput>({
          data: cache,
          query: GET_TRANSACTIONS,
          variables: {
            companyId: addTransaction.companyId,
            status: addTransaction.status,
          },
        });
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}

    try {
      const cache = client.readQuery<IGetTypeaheadOutput, IGetTypeaheadInput>({
        query: GET_TYPEAHEAD,
        variables: {
          id: addTransaction.companyId,
        },
      });

      if (cache) {
        if (addTransaction.category === 'Sales') {
          const descriptions = new Set([
            ...(cache.getTypeahead.sales === null
              ? []
              : cache.getTypeahead.sales),
            addTransaction.description,
          ]);

          cache.getTypeahead.sales = [...descriptions];
        } else {
          const suppliers = new Set([
            ...(cache.getTypeahead.suppliers === null
              ? []
              : cache.getTypeahead.suppliers),
            addTransaction.name,
          ]);
          const descriptions = new Set([
            ...(cache.getTypeahead.purchases === null
              ? []
              : cache.getTypeahead.purchases),
            addTransaction.description,
          ]);

          cache.getTypeahead.purchases = [...descriptions];
          cache.getTypeahead.suppliers = [...suppliers];
        }

        client.writeQuery<IGetTypeaheadOutput, IGetTypeaheadInput>({
          data: cache,
          query: GET_TYPEAHEAD,
          variables: {
            id: addTransaction.companyId,
          },
        });
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}
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
      status
      vat
    }
  }
`;

export default ADD_TRANSACTION;
