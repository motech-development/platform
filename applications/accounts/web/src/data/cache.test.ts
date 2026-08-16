import { gql } from '@apollo/client';
import { createAccountsCache } from './cache';

const transactionsQuery = gql`
  query CacheTransactions(
    $id: ID!
    $status: TransactionStatus!
    $count: Int
    $nextToken: String
  ) {
    getTransactions(
      id: $id
      status: $status
      count: $count
      nextToken: $nextToken
    ) {
      __typename
      id
      status
      nextToken
      items {
        __typename
        id
        date
        name
      }
    }
  }
`;

const clientsQuery = gql`
  query CacheClients($id: ID!, $nextToken: String) {
    getClients(id: $id, nextToken: $nextToken) {
      __typename
      id
      nextToken
      items {
        __typename
        contact {
          email
        }
        id
        name
      }
    }
  }
`;

const partialClientsQuery = gql`
  query CachePartialClients($id: ID!) {
    getClients(id: $id) {
      __typename
      id
      items {
        __typename
        id
        name
      }
    }
  }
`;

const clientPageStateQuery = gql`
  query CacheClientPageState($id: ID!) {
    getClients(id: $id) {
      clientLoadedPageCount @client
      clientRequestedPageCount @client
      clientRefreshGeneration @client
    }
  }
`;

const notificationsQuery = gql`
  query CacheNotifications($id: ID!, $count: Int) {
    getNotifications(id: $id, count: $count) {
      __typename
      id
      items {
        __typename
        createdAt
        id
        message
        owner
        read
      }
    }
  }
`;

const variables = {
  count: 100,
  id: 'company-1',
  status: 'confirmed',
};

describe('confirmed Transaction pages', () => {
  it('retains loaded Transactions when a refresh omits its item list', () => {
    const cache = createAccountsCache();

    cache.writeQuery({
      data: {
        getTransactions: {
          __typename: 'Transactions',
          id: 'company-1',
          items: [],
          nextToken: 'page-2',
          status: 'confirmed',
        },
      },
      query: transactionsQuery,
      variables,
    });
    cache.writeQuery({
      data: {
        getTransactions: {
          __typename: 'Transactions',
          id: 'company-1',
          items: [
            {
              __typename: 'Transaction',
              date: '2026-07-27T00:00:00.000Z',
              id: 'continued',
              name: 'Continued sale',
            },
          ],
          nextToken: null,
          status: 'confirmed',
        },
      },
      query: transactionsQuery,
      variables: { ...variables, nextToken: 'page-2' },
    });
    cache.writeQuery({
      data: {
        getTransactions: {
          __typename: 'Transactions',
          id: 'company-1',
          nextToken: null,
          status: 'confirmed',
        },
      } as never,
      query: transactionsQuery,
      variables,
    });

    expect(
      cache
        .readQuery<{ getTransactions: { items: Array<{ id: string }> } }>({
          query: transactionsQuery,
          variables,
        })
        ?.getTransactions.items.map(({ id }) => id),
    ).toEqual(['continued']);
  });

  it('keeps dashboard and ledger page sizes in separate cache entries', () => {
    const cache = createAccountsCache();
    const dashboardVariables = { ...variables, count: 5 };

    cache.writeQuery({
      data: {
        getTransactions: {
          __typename: 'Transactions',
          id: 'company-1',
          items: [
            {
              __typename: 'Transaction',
              date: '2026-07-27T00:00:00.000Z',
              id: 'dashboard',
              name: 'Dashboard sale',
            },
          ],
          nextToken: null,
          status: 'confirmed',
        },
      },
      query: transactionsQuery,
      variables: dashboardVariables,
    });
    cache.writeQuery({
      data: {
        getTransactions: {
          __typename: 'Transactions',
          id: 'company-1',
          items: [
            {
              __typename: 'Transaction',
              date: '2026-07-28T00:00:00.000Z',
              id: 'ledger',
              name: 'Ledger sale',
            },
          ],
          nextToken: null,
          status: 'confirmed',
        },
      },
      query: transactionsQuery,
      variables,
    });

    expect(
      cache
        .readQuery<{ getTransactions: { items: { id: string }[] } }>({
          query: transactionsQuery,
          variables: dashboardVariables,
        })
        ?.getTransactions.items.map(({ id }) => id),
    ).toEqual(['dashboard']);
    expect(
      cache
        .readQuery<{ getTransactions: { items: { id: string }[] } }>({
          query: transactionsQuery,
          variables,
        })
        ?.getTransactions.items.map(({ id }) => id),
    ).toEqual(['ledger']);
  });

  it('replaces a stale first page with the authoritative result', () => {
    const cache = createAccountsCache();

    cache.writeQuery({
      data: {
        getTransactions: {
          __typename: 'Transactions',
          id: 'company-1',
          items: [
            {
              __typename: 'Transaction',
              date: '2026-07-25T00:00:00.000Z',
              id: 'stale',
              name: 'Stale sale',
            },
          ],
          nextToken: 'stale-token',
          status: 'confirmed',
        },
      },
      query: transactionsQuery,
      variables,
    });

    cache.writeQuery({
      data: {
        getTransactions: {
          __typename: 'Transactions',
          id: 'company-1',
          items: [
            {
              __typename: 'Transaction',
              date: '2026-07-27T00:00:00.000Z',
              id: 'authoritative',
              name: 'Authoritative sale',
            },
          ],
          nextToken: 'fresh-token',
          status: 'confirmed',
        },
      },
      query: transactionsQuery,
      variables,
    });

    expect(cache.readQuery({ query: transactionsQuery, variables })).toEqual({
      getTransactions: {
        __typename: 'Transactions',
        id: 'company-1',
        items: [
          {
            __typename: 'Transaction',
            date: '2026-07-27T00:00:00.000Z',
            id: 'authoritative',
            name: 'Authoritative sale',
          },
        ],
        nextToken: 'fresh-token',
        status: 'confirmed',
      },
    });
  });

  it('appends a continuation page and removes overlapping transactions', () => {
    const cache = createAccountsCache();

    cache.writeQuery({
      data: {
        getTransactions: {
          __typename: 'Transactions',
          id: 'company-1',
          items: [
            {
              __typename: 'Transaction',
              date: '2026-07-26T00:00:00.000Z',
              id: 'first',
              name: 'First sale',
            },
            {
              __typename: 'Transaction',
              date: '2026-07-27T00:00:00.000Z',
              id: 'overlap',
              name: 'Overlapping sale',
            },
          ],
          nextToken: 'page-2',
          status: 'confirmed',
        },
      },
      query: transactionsQuery,
      variables,
    });

    cache.writeQuery({
      data: {
        getTransactions: {
          __typename: 'Transactions',
          id: 'company-1',
          items: [
            {
              __typename: 'Transaction',
              date: '2026-07-27T00:00:00.000Z',
              id: 'overlap',
              name: 'Overlapping sale',
            },
            {
              __typename: 'Transaction',
              date: '2026-07-28T00:00:00.000Z',
              id: 'second',
              name: 'Second sale',
            },
          ],
          nextToken: null,
          status: 'confirmed',
        },
      },
      query: transactionsQuery,
      variables: { ...variables, nextToken: 'page-2' },
    });

    expect(
      cache
        .readQuery<{ getTransactions: { items: { id: string }[] } }>({
          query: transactionsQuery,
          variables,
        })
        ?.getTransactions.items.map(({ id }) => id),
    ).toEqual(['first', 'overlap', 'second']);
  });

  it('preserves loaded continuation Transactions during a first-page refresh', () => {
    const cache = createAccountsCache();

    cache.writeQuery({
      data: {
        getTransactions: {
          __typename: 'Transactions',
          id: 'company-1',
          items: [
            {
              __typename: 'Transaction',
              date: '2026-07-27T00:00:00.000Z',
              id: 'first',
              name: 'First sale',
            },
          ],
          nextToken: 'page-2',
          status: 'confirmed',
        },
      },
      query: transactionsQuery,
      variables,
    });
    cache.writeQuery({
      data: {
        getTransactions: {
          __typename: 'Transactions',
          id: 'company-1',
          items: [
            {
              __typename: 'Transaction',
              date: '2026-07-26T00:00:00.000Z',
              id: 'second',
              name: 'Second sale',
            },
          ],
          nextToken: 'page-3',
          status: 'confirmed',
        },
      },
      query: transactionsQuery,
      variables: { ...variables, nextToken: 'page-2' },
    });

    cache.writeQuery({
      data: {
        getTransactions: {
          __typename: 'Transactions',
          id: 'company-1',
          items: [
            {
              __typename: 'Transaction',
              date: '2026-07-28T00:00:00.000Z',
              id: 'first',
              name: 'Updated first sale',
            },
          ],
          nextToken: 'refreshed-page-2',
          status: 'confirmed',
        },
      },
      query: transactionsQuery,
      variables,
    });

    const collection = cache.readQuery<{
      getTransactions: { items: { id: string }[]; nextToken: string };
    }>({ query: transactionsQuery, variables });

    expect(collection?.getTransactions.items.map(({ id }) => id)).toEqual([
      'first',
      'second',
    ]);
    expect(collection?.getTransactions.nextToken).toBe('page-3');
  });
});

describe('owner notifications', () => {
  const notificationVariables = { count: 5, id: 'auth0|owner' };
  const notification = (id: string, createdAt: string, read = false) => ({
    __typename: 'Notification',
    createdAt,
    id,
    message: 'REPORT_READY_TO_DOWNLOAD',
    owner: notificationVariables.id,
    read,
  });
  const writeNotifications = (
    cache: ReturnType<typeof createAccountsCache>,
    items: ReturnType<typeof notification>[],
  ) => {
    cache.writeQuery({
      data: {
        getNotifications: {
          __typename: 'Notifications',
          id: notificationVariables.id,
          items,
        },
      },
      query: notificationsQuery,
      variables: notificationVariables,
    });
  };

  it('retains a live notification when an eventually consistent query arrives later', () => {
    const cache = createAccountsCache();

    writeNotifications(cache, [
      notification('live', '2026-08-12T10:00:00.000Z'),
    ]);
    writeNotifications(cache, [
      notification('query', '2026-08-12T09:00:00.000Z'),
    ]);

    expect(
      cache
        .readQuery<{ getNotifications: { items: { id: string }[] } }>({
          query: notificationsQuery,
          variables: notificationVariables,
        })
        ?.getNotifications.items.map(({ id }) => id),
    ).toEqual(['live', 'query']);
  });

  it('lets reconnect eviction replace retained events with authoritative state', () => {
    const cache = createAccountsCache();

    writeNotifications(cache, [
      notification('stale-live', '2026-08-12T10:00:00.000Z'),
    ]);
    cache.evict({ fieldName: 'getNotifications', id: 'ROOT_QUERY' });
    cache.gc();
    writeNotifications(cache, [
      notification('authoritative', '2026-08-12T11:00:00.000Z'),
    ]);

    expect(
      cache
        .readQuery<{ getNotifications: { items: { id: string }[] } }>({
          query: notificationsQuery,
          variables: notificationVariables,
        })
        ?.getNotifications.items.map(({ id }) => id),
    ).toEqual(['authoritative']);
  });
});

describe('client pages', () => {
  const writeClients = (
    cache: ReturnType<typeof createAccountsCache>,
    ids: readonly string[],
    nextToken: string | null,
    pageToken?: string,
  ) => {
    cache.writeQuery({
      data: {
        getClients: {
          __typename: 'Clients',
          id: 'company-1',
          items: ids.map((id) => ({
            __typename: 'Client',
            contact: { email: `${id}@example.com` },
            id,
            name: id.toUpperCase(),
          })),
          nextToken,
        },
      },
      query: clientsQuery,
      variables: {
        id: 'company-1',
        ...(pageToken ? { nextToken: pageToken } : {}),
      },
    });
  };

  it('preserves the complete collection when a partial consumer writes later', () => {
    const cache = createAccountsCache();

    writeClients(cache, ['complete'], 'page-2');
    cache.writeQuery({
      data: {
        getClients: {
          __typename: 'Clients',
          id: 'company-1',
          items: [
            {
              __typename: 'Client',
              id: 'partial',
              name: 'PARTIAL',
            },
          ],
        },
      },
      query: partialClientsQuery,
      variables: { id: 'company-1' },
    });

    expect(
      cache
        .readQuery<{ getClients: { items: { id: string }[] } }>({
          query: clientsQuery,
          variables: { id: 'company-1' },
        })
        ?.getClients.items.map(({ id }) => id),
    ).toEqual(['complete']);
  });

  it('reopens pagination when a refresh extends an exhausted collection', () => {
    const cache = createAccountsCache();

    cache.writeQuery({
      data: {
        getClients: {
          __typename: 'Clients',
          id: 'company-1',
          items: [
            {
              __typename: 'Client',
              contact: { email: 'alice@example.com' },
              id: 'first',
              name: 'Alice',
            },
            {
              __typename: 'Client',
              contact: { email: 'stale@example.com' },
              id: 'second',
              name: 'Second client',
            },
          ],
          nextToken: 'page-2',
        },
      },
      query: clientsQuery,
      variables: { id: 'company-1' },
    });
    cache.writeQuery({
      data: {
        getClients: {
          __typename: 'Clients',
          id: 'company-1',
          items: [
            {
              __typename: 'Client',
              contact: { email: 'later@example.com' },
              id: 'third',
              name: 'Third client',
            },
          ],
          nextToken: null,
        },
      },
      query: clientsQuery,
      variables: { id: 'company-1', nextToken: 'page-2' },
    });
    cache.writeQuery({
      data: {
        getClients: {
          __typename: 'Clients',
          id: 'company-1',
          items: [
            {
              __typename: 'Client',
              contact: { email: 'alice@example.com' },
              id: 'first',
              name: 'Alice',
            },
            {
              __typename: 'Client',
              contact: { email: 'stale@example.com' },
              id: 'second',
              name: 'Second client',
            },
          ],
          nextToken: 'refreshed-page-2',
        },
      },
      query: clientsQuery,
      variables: { id: 'company-1' },
    });

    expect(
      cache.readQuery<{
        getClients: { items: { id: string }[]; nextToken: string };
      }>({ query: clientsQuery, variables: { id: 'company-1' } })?.getClients,
    ).toMatchObject({
      items: [{ id: 'first' }, { id: 'second' }],
      nextToken: 'refreshed-page-2',
    });
    expect(
      cache.readQuery({
        query: clientPageStateQuery,
        variables: { id: 'company-1' },
      }),
    ).toEqual({
      getClients: {
        __typename: 'Clients',
        clientLoadedPageCount: 1,
        clientRefreshGeneration: 1,
        clientRequestedPageCount: 2,
      },
    });
  });

  it('drops deleted clients while rebuilding previously loaded pages', () => {
    const cache = createAccountsCache();

    writeClients(cache, ['a', 'b'], 'page-2');
    writeClients(cache, ['c', 'd'], null, 'page-2');
    writeClients(cache, ['a', 'c'], 'refreshed-page-2');
    writeClients(cache, ['d'], null, 'refreshed-page-2');

    expect(
      cache
        .readQuery<{ getClients: { items: { id: string }[] } }>({
          query: clientsQuery,
          variables: { id: 'company-1' },
        })
        ?.getClients.items.map(({ id }) => id),
    ).toEqual(['a', 'c', 'd']);
  });

  it('counts each continuation token once while rebuilding loaded pages', () => {
    const cache = createAccountsCache();

    writeClients(cache, ['a'], 'page-2');
    writeClients(cache, ['b'], 'page-3', 'page-2');
    writeClients(cache, ['c'], null, 'page-3');
    writeClients(cache, ['a'], 'refreshed-page-2');
    writeClients(cache, ['b'], 'refreshed-page-3', 'refreshed-page-2');
    writeClients(cache, ['b'], 'refreshed-page-3', 'refreshed-page-2');

    expect(
      cache.readQuery({
        query: clientPageStateQuery,
        variables: { id: 'company-1' },
      }),
    ).toEqual({
      getClients: {
        __typename: 'Clients',
        clientLoadedPageCount: 2,
        clientRefreshGeneration: 1,
        clientRequestedPageCount: 3,
      },
    });
  });
});
