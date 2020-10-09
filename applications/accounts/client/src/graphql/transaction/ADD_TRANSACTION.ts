import { gql, MutationUpdaterFn } from '@apollo/client';
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
    scheduled: boolean;
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
    scheduled: boolean;
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
          id: addTransaction.id,
          status: addTransaction.status,
        },
      });

      if (cache) {
        const items = [
          ...cache.getTransactions.items,
          addTransaction,
        ].sort((a, b) => a.date.localeCompare(b.date));

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
            id: addTransaction.companyId,
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
        const getTypeahead = {
          ...cache.getTypeahead,
        };

        if (addTransaction.category === 'Sales') {
          const descriptions = new Set([
            ...(cache.getTypeahead.sales === null
              ? []
              : cache.getTypeahead.sales),
            addTransaction.description,
          ]);

          getTypeahead.sales = [...descriptions];
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

          getTypeahead.purchases = [...descriptions];
          getTypeahead.suppliers = [...suppliers];
        }

        client.writeQuery<IGetTypeaheadOutput, IGetTypeaheadInput>({
          data: {
            getTypeahead,
          },
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
      scheduled
      status
      vat
    }
  }
`;

export default ADD_TRANSACTION;
