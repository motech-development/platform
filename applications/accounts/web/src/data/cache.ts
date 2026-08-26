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
          clientLoadedContinuationTokens: [],
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
      clientLoadedContinuationTokens: [],
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
  const continuationToken =
    typeof args?.nextToken === 'string' ? args.nextToken : undefined;
  const loadedContinuationTokens =
    existing.clientLoadedContinuationTokens ?? [];
  const continuationAlreadyLoaded =
    continuationToken !== undefined &&
    loadedContinuationTokens.includes(continuationToken);
  const loadedPageCount = existing.clientLoadedPageCount ?? 1;
  const nextLoadedPageCount = continuationAlreadyLoaded
    ? loadedPageCount
    : loadedPageCount + 1;
  const retainedItems =
    existing.items?.filter(
      (client) => !incomingIdSet.has(entityId(client, readField) ?? ''),
    ) ?? [];

  return {
    ...incoming,
    clientLoadedContinuationTokens:
      continuationToken && !continuationAlreadyLoaded
        ? [...loadedContinuationTokens, continuationToken]
        : loadedContinuationTokens,
    clientLoadedPageCount: nextLoadedPageCount,
    clientRefreshGeneration: existing.clientRefreshGeneration ?? 0,
    clientRequestedPageCount: Math.max(
      nextLoadedPageCount,
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
          transactionLoadedContinuationTokens: [],
          transactionLoadedPageCount: 1,
          transactionRefreshGeneration: 0,
          transactionRequestedPageCount: 1,
        }
      : incoming;
  }

  if (!args?.nextToken && partialFirstPage) {
    return existing;
  }

  if (!args?.nextToken) {
    const loadedPageCount = existing.transactionLoadedPageCount ?? 1;

    return {
      ...incoming,
      transactionLoadedContinuationTokens: [],
      transactionLoadedPageCount: 1,
      transactionRefreshGeneration:
        (existing.transactionRefreshGeneration ?? 0) + 1,
      transactionRequestedPageCount: Math.max(
        loadedPageCount,
        existing.transactionRequestedPageCount ?? 1,
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
  const loadedContinuationTokens =
    existing.transactionLoadedContinuationTokens ?? [];
  const continuationAlreadyLoaded =
    continuationToken !== undefined &&
    loadedContinuationTokens.includes(continuationToken);
  const loadedPageCount = existing.transactionLoadedPageCount ?? 1;
  const nextLoadedPageCount = continuationAlreadyLoaded
    ? loadedPageCount
    : loadedPageCount + 1;

  return {
    ...incoming,
    items: [...retainedItems, ...incomingItems],
    transactionLoadedContinuationTokens:
      continuationToken && !continuationAlreadyLoaded
        ? [...loadedContinuationTokens, continuationToken]
        : loadedContinuationTokens,
    transactionLoadedPageCount: nextLoadedPageCount,
    transactionRefreshGeneration: existing.transactionRefreshGeneration ?? 0,
    transactionRequestedPageCount: Math.max(
      nextLoadedPageCount,
      existing.transactionRequestedPageCount ?? 1,
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
            read(value: number | undefined) {
              return value ?? 1;
            },
          },
          transactionRefreshGeneration: {
            read(value: number | undefined) {
              return value ?? 0;
            },
          },
          transactionRequestedPageCount: {
            read(value: number | undefined) {
              return value ?? 1;
            },
          },
        },
        keyFields: false,
      },
    },
  });
}
