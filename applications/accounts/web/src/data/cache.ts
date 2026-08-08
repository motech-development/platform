import type {
  FieldFunctionOptions,
  Reference,
  StoreObject,
} from '@apollo/client';
import { InMemoryCache } from '@apollo/client-integration-tanstack-start';

type TransactionReference = Reference | StoreObject;

interface TransactionPage {
  readonly __typename?: 'Transactions';
  readonly id?: string;
  readonly items?: readonly TransactionReference[];
  readonly nextToken?: string | null;
  readonly status?: string;
}

function transactionId(
  transaction: TransactionReference,
  readField: FieldFunctionOptions['readField'],
) {
  return readField<string>('id', transaction);
}

function mergeTransactionPages(
  existing: TransactionPage | undefined,
  incoming: TransactionPage,
  { args, readField }: FieldFunctionOptions,
): TransactionPage {
  if (!args?.nextToken || !existing) {
    return incoming;
  }

  const incomingIds = new Set(
    incoming.items
      ?.map((transaction) => transactionId(transaction, readField))
      .filter(Boolean),
  );

  return {
    ...incoming,
    items: [
      ...(existing.items?.filter(
        (transaction) =>
          !incomingIds.has(transactionId(transaction, readField)),
      ) ?? []),
      ...(incoming.items ?? []),
    ],
  };
}

export function createAccountsCache() {
  return new InMemoryCache({
    typePolicies: {
      Balance: {
        keyFields: ['id'],
      },
      Companies: {
        keyFields: ['id'],
      },
      Company: {
        keyFields: ['id'],
      },
      Query: {
        fields: {
          getTransactions: {
            keyArgs: ['count', 'id', 'status'],
            merge: mergeTransactionPages,
          },
        },
      },
      Transaction: {
        keyFields: ['id'],
      },
      // The query arguments provide the stable company/status identity. Keeping
      // the wrapper embedded lets its field policy distinguish first pages from
      // continuation pages without persisting any authenticated data.
      Transactions: {
        keyFields: false,
      },
    },
  });
}
