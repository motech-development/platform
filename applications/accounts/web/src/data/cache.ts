import type {
  FieldFunctionOptions,
  Reference,
  StoreObject,
} from '@apollo/client';
import { InMemoryCache } from '@apollo/client-integration-tanstack-start';

type CacheReference = Reference | StoreObject;

interface ClientPage {
  readonly firstPageIds?: readonly string[];
  readonly loadedContinuation?: boolean;
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
          firstPageIds: incomingIds,
          loadedContinuation: false,
        }
      : incoming;
  }

  if (!args?.nextToken && !partialFirstPage) {
    if (!existing.loadedContinuation || incoming.nextToken === null) {
      return {
        ...incoming,
        firstPageIds: incomingIds,
        loadedContinuation: false,
      };
    }

    const previousFirstPageIds = new Set(existing.firstPageIds ?? []);
    const refreshedFirstPageIds = new Set(incomingIds);
    const retainedContinuation =
      existing.items?.filter((client) => {
        const id = entityId(client, readField);

        return (
          !previousFirstPageIds.has(id ?? '') &&
          !refreshedFirstPageIds.has(id ?? '')
        );
      }) ?? [];

    return {
      ...incoming,
      firstPageIds: incomingIds,
      items: [...incomingItems, ...retainedContinuation],
      loadedContinuation: true,
      nextToken: existing.nextToken,
    };
  }

  if (partialFirstPage) {
    const incomingById = new Map(
      incoming.items?.map((client) => [entityId(client, readField), client]),
    );

    return {
      ...existing,
      ...incoming,
      items: existing.items?.map(
        (client) => incomingById.get(entityId(client, readField)) ?? client,
      ),
      nextToken: existing.nextToken,
    };
  }

  const incomingIdSet = new Set(incomingIds);
  const retainedItems =
    existing.items?.filter(
      (client) => !incomingIdSet.has(entityId(client, readField) ?? ''),
    ) ?? [];

  return {
    ...incoming,
    firstPageIds: existing.firstPageIds,
    items: [...retainedItems, ...incomingItems],
    loadedContinuation: true,
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
