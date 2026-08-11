import type {
  FieldFunctionOptions,
  Reference,
  StoreObject,
} from '@apollo/client';
import { InMemoryCache } from '@apollo/client-integration-tanstack-start';

type CacheReference = Reference | StoreObject;

interface ClientPage {
  readonly __typename?: 'Clients';
  readonly id?: string;
  readonly items?: readonly CacheReference[];
  readonly nextToken?: string | null;
}

interface TransactionPage {
  readonly __typename?: 'Transactions';
  readonly id?: string;
  readonly items?: readonly CacheReference[];
  readonly nextToken?: string | null;
  readonly status?: string;
}

function entityId(
  entity: CacheReference,
  readField: FieldFunctionOptions['readField'],
) {
  return readField<string>('id', entity);
}

function mergeClientPages(
  existing: ClientPage | undefined,
  incoming: ClientPage,
  { args, readField }: FieldFunctionOptions,
): ClientPage {
  if (!existing) {
    return incoming;
  }

  const partialFirstPage = incoming.nextToken === undefined;
  if (!args?.nextToken && !partialFirstPage) {
    return incoming;
  }

  const incomingIds = new Set(
    incoming.items
      ?.map((client) => entityId(client, readField))
      .filter(Boolean),
  );
  const retainedItems =
    existing.items?.filter(
      (client) => !incomingIds.has(entityId(client, readField)),
    ) ?? [];

  if (partialFirstPage) {
    return {
      ...existing,
      ...incoming,
      items: [...(incoming.items ?? []), ...retainedItems],
      nextToken: existing.nextToken,
    };
  }

  return {
    ...incoming,
    items: [...retainedItems, ...(incoming.items ?? [])],
  };
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
      ?.map((transaction) => entityId(transaction, readField))
      .filter(Boolean),
  );

  return {
    ...incoming,
    items: [
      ...(existing.items?.filter(
        (transaction) => !incomingIds.has(entityId(transaction, readField)),
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
      Clients: {
        keyFields: false,
      },
      Companies: {
        keyFields: ['id'],
      },
      Company: {
        keyFields: ['id'],
      },
      Query: {
        fields: {
          getClients: {
            keyArgs: ['id'],
            merge: mergeClientPages,
          },
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
