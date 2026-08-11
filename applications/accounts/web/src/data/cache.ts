import type {
  FieldFunctionOptions,
  Reference,
  StoreObject,
} from '@apollo/client';
import { InMemoryCache } from '@apollo/client-integration-tanstack-start';

type CacheReference = Reference | StoreObject;

interface ClientPage {
  readonly clientLoadedPageCount?: number;
  readonly clientRequestedPageCount?: number;
  readonly clientRefreshGeneration?: number;
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
  const partialFirstPage = incoming.nextToken === undefined;
  const incomingItems = incoming.items ?? [];
  const incomingIds = incomingItems
    .map((client) => entityId(client, readField))
    .filter((id): id is string => id !== undefined);

  if (!existing) {
    return !args?.nextToken && !partialFirstPage
      ? {
          ...incoming,
          clientLoadedPageCount: 1,
          clientRefreshGeneration: 0,
          clientRequestedPageCount: 1,
        }
      : incoming;
  }

  if (!args?.nextToken && !partialFirstPage) {
    const loadedPageCount = existing.clientLoadedPageCount ?? 1;

    return {
      ...incoming,
      clientLoadedPageCount: 1,
      clientRefreshGeneration: (existing.clientRefreshGeneration ?? 0) + 1,
      clientRequestedPageCount: Math.max(
        loadedPageCount,
        existing.clientRequestedPageCount ?? 1,
      ),
    };
  }

  if (partialFirstPage) {
    // Partial client consumers bypass cache writes. Preserve the complete
    // management collection if an incidental partial write reaches this field.
    return existing;
  }

  const incomingIdSet = new Set(incomingIds);
  const retainedItems =
    existing.items?.filter(
      (client) => !incomingIdSet.has(entityId(client, readField) ?? ''),
    ) ?? [];

  return {
    ...incoming,
    clientLoadedPageCount: (existing.clientLoadedPageCount ?? 1) + 1,
    clientRefreshGeneration: existing.clientRefreshGeneration ?? 0,
    clientRequestedPageCount: Math.max(
      (existing.clientLoadedPageCount ?? 1) + 1,
      existing.clientRequestedPageCount ?? 1,
    ),
    items: [...retainedItems, ...incomingItems],
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
        fields: {
          clientLoadedPageCount: {
            read(value: number | undefined) {
              return value ?? 1;
            },
          },
          clientRefreshGeneration: {
            read(value: number | undefined) {
              return value ?? 0;
            },
          },
          clientRequestedPageCount: {
            read(value: number | undefined) {
              return value ?? 1;
            },
          },
        },
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
