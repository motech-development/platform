import type {
  FieldFunctionOptions,
  Reference,
  StoreObject,
} from '@apollo/client';
import { InMemoryCache } from '@apollo/client-integration-tanstack-start';

type CacheReference = Reference | StoreObject;

interface ClientPage {
  readonly clientLoadedContinuationTokens?: readonly string[];
  readonly clientLoadedPageCount?: number;
  readonly clientRequestedPageCount?: number;
  readonly clientRefreshGeneration?: number;
  readonly __typename?: 'Clients';
  readonly id?: string;
  readonly items?: readonly CacheReference[];
  readonly nextToken?: string | null;
}

interface TransactionPage {
  readonly transactionLoadedContinuationTokens?: readonly string[];
  readonly transactionLoadedPageCount?: number;
  readonly transactionRefreshGeneration?: number;
  readonly transactionRequestedPageCount?: number;
  readonly __typename?: 'Transactions';
  readonly id?: string;
  readonly items?: readonly CacheReference[];
  readonly nextToken?: string | null;
  readonly status?: string;
}

interface NotificationCollection {
  readonly __typename?: 'Notifications';
  readonly id?: string | null;
  readonly items?: readonly CacheReference[];
}

interface PaginationMetadata {
  readonly loadedContinuationTokens: readonly string[];
  readonly loadedPageCount: number;
  readonly refreshGeneration: number;
  readonly requestedPageCount: number;
}

const initialPaginationMetadata: PaginationMetadata = {
  loadedContinuationTokens: [],
  loadedPageCount: 1,
  refreshGeneration: 0,
  requestedPageCount: 1,
};

function refreshedPaginationMetadata(
  current: PaginationMetadata,
): PaginationMetadata {
  return {
    loadedContinuationTokens: [],
    loadedPageCount: 1,
    refreshGeneration: current.refreshGeneration + 1,
    requestedPageCount: Math.max(
      current.loadedPageCount,
      current.requestedPageCount,
    ),
  };
}

function continuedPaginationMetadata(
  current: PaginationMetadata,
  continuationToken: string | undefined,
): PaginationMetadata {
  const continuationAlreadyLoaded =
    continuationToken !== undefined &&
    current.loadedContinuationTokens.includes(continuationToken);
  const loadedPageCount = continuationAlreadyLoaded
    ? current.loadedPageCount
    : current.loadedPageCount + 1;

  return {
    loadedContinuationTokens:
      continuationToken && !continuationAlreadyLoaded
        ? [...current.loadedContinuationTokens, continuationToken]
        : current.loadedContinuationTokens,
    loadedPageCount,
    refreshGeneration: current.refreshGeneration,
    requestedPageCount: Math.max(loadedPageCount, current.requestedPageCount),
  };
}

function clientPaginationMetadata(page: ClientPage): PaginationMetadata {
  return {
    loadedContinuationTokens: page.clientLoadedContinuationTokens ?? [],
    loadedPageCount: page.clientLoadedPageCount ?? 1,
    refreshGeneration: page.clientRefreshGeneration ?? 0,
    requestedPageCount: page.clientRequestedPageCount ?? 1,
  };
}

function clientPaginationFields(metadata: PaginationMetadata) {
  return {
    clientLoadedContinuationTokens: metadata.loadedContinuationTokens,
    clientLoadedPageCount: metadata.loadedPageCount,
    clientRefreshGeneration: metadata.refreshGeneration,
    clientRequestedPageCount: metadata.requestedPageCount,
  };
}

function transactionPaginationMetadata(
  page: TransactionPage,
): PaginationMetadata {
  return {
    loadedContinuationTokens: page.transactionLoadedContinuationTokens ?? [],
    loadedPageCount: page.transactionLoadedPageCount ?? 1,
    refreshGeneration: page.transactionRefreshGeneration ?? 0,
    requestedPageCount: page.transactionRequestedPageCount ?? 1,
  };
}

function transactionPaginationFields(metadata: PaginationMetadata) {
  return {
    transactionLoadedContinuationTokens: metadata.loadedContinuationTokens,
    transactionLoadedPageCount: metadata.loadedPageCount,
    transactionRefreshGeneration: metadata.refreshGeneration,
    transactionRequestedPageCount: metadata.requestedPageCount,
  };
}

const pageCountFieldPolicy = {
  read(value: number | undefined) {
    return value ?? 1;
  },
};
const refreshGenerationFieldPolicy = {
  read(value: number | undefined) {
    return value ?? 0;
  },
};

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
          ...clientPaginationFields(initialPaginationMetadata),
        }
      : incoming;
  }

  if (!args?.nextToken && !partialFirstPage) {
    return {
      ...incoming,
      ...clientPaginationFields(
        refreshedPaginationMetadata(clientPaginationMetadata(existing)),
      ),
    };
  }

  if (partialFirstPage) {
    // Partial client consumers bypass cache writes. Preserve the complete
    // management collection if an incidental partial write reaches this field.
    return existing;
  }

  const incomingIdSet = new Set(incomingIds);
  const continuationToken =
    typeof args?.nextToken === 'string' ? args.nextToken : undefined;
  const retainedItems =
    existing.items?.filter(
      (client) => !incomingIdSet.has(entityId(client, readField) ?? ''),
    ) ?? [];

  return {
    ...incoming,
    ...clientPaginationFields(
      continuedPaginationMetadata(
        clientPaginationMetadata(existing),
        continuationToken,
      ),
    ),
    items: [...retainedItems, ...incomingItems],
  };
}

function mergeTransactionPages(
  existing: TransactionPage | undefined,
  incoming: TransactionPage,
  { args, readField }: FieldFunctionOptions,
): TransactionPage {
  const partialFirstPage = incoming.items === undefined;
  const incomingItems = incoming.items ?? [];
  const incomingIds = new Set(
    incomingItems
      .map((transaction) => entityId(transaction, readField))
      .filter(Boolean),
  );
  if (!existing) {
    return !args?.nextToken
      ? {
          ...incoming,
          ...transactionPaginationFields(initialPaginationMetadata),
        }
      : incoming;
  }

  if (!args?.nextToken && partialFirstPage) {
    return existing;
  }

  if (!args?.nextToken) {
    return {
      ...incoming,
      ...transactionPaginationFields(
        refreshedPaginationMetadata(transactionPaginationMetadata(existing)),
      ),
    };
  }

  if (args.nextToken !== existing.nextToken) {
    // A first-page refresh can replace the active cursor while an older
    // continuation is still in flight. The older page belongs to the previous
    // boundary and must not overwrite or extend the refreshed collection.
    return existing;
  }

  const retainedItems =
    existing.items?.filter(
      (transaction) => !incomingIds.has(entityId(transaction, readField)),
    ) ?? [];
  const continuationToken =
    typeof args.nextToken === 'string' ? args.nextToken : undefined;

  return {
    ...incoming,
    items: [...retainedItems, ...incomingItems],
    ...transactionPaginationFields(
      continuedPaginationMetadata(
        transactionPaginationMetadata(existing),
        continuationToken,
      ),
    ),
  };
}

function mergeNotifications(
  existing: NotificationCollection | undefined,
  incoming: NotificationCollection,
  { args, readField }: FieldFunctionOptions,
): NotificationCollection {
  const notifications = [...(incoming.items ?? []), ...(existing?.items ?? [])];
  const count =
    typeof args?.count === 'number' ? args.count : notifications.length;
  const byId = new Map<string, CacheReference>();

  notifications.forEach((notification) => {
    const id = entityId(notification, readField);

    if (id && !byId.has(id)) {
      byId.set(id, notification);
    }
  });

  return {
    ...existing,
    ...incoming,
    items: [...byId.values()]
      .sort((left, right) => {
        const leftCreatedAt = readField<string>('createdAt', left) ?? '';
        const rightCreatedAt = readField<string>('createdAt', right) ?? '';

        return Date.parse(rightCreatedAt) - Date.parse(leftCreatedAt);
      })
      .slice(0, count),
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
            ...pageCountFieldPolicy,
          },
          clientRefreshGeneration: {
            ...refreshGenerationFieldPolicy,
          },
          clientRequestedPageCount: {
            ...pageCountFieldPolicy,
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
      Notification: {
        fields: {
          read: {
            merge: (existing: boolean | undefined, incoming: boolean) =>
              existing === true || incoming,
          },
        },
        keyFields: ['id'],
      },
      Notifications: {
        keyFields: false,
      },
      Query: {
        fields: {
          getClients: {
            keyArgs: ['id'],
            merge: mergeClientPages,
          },
          getNotifications: {
            keyArgs: ['count', 'id'],
            merge: mergeNotifications,
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
        fields: {
          transactionLoadedPageCount: {
            ...pageCountFieldPolicy,
          },
          transactionRefreshGeneration: {
            ...refreshGenerationFieldPolicy,
          },
          transactionRequestedPageCount: {
            ...pageCountFieldPolicy,
          },
        },
        keyFields: false,
      },
    },
  });
}
