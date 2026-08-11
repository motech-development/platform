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
        id
        name
      }
    }
  }
`;

const recordTransactionClientsQuery = gql`
  query CacheRecordTransactionClients($id: ID!) {
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

const variables = {
  count: 100,
  id: 'company-1',
  status: 'confirmed',
};

describe('confirmed Transaction pages', () => {
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
});

describe('client pages', () => {
  it('preserves loaded management pages across the transaction lookup', () => {
    const cache = createAccountsCache();

    cache.writeQuery({
      data: {
        getClients: {
          __typename: 'Clients',
          id: 'company-1',
          items: [{ __typename: 'Client', id: 'first', name: 'First client' }],
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
            { __typename: 'Client', id: 'second', name: 'Second client' },
          ],
          nextToken: 'page-3',
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
          items: [{ __typename: 'Client', id: 'first', name: 'Updated first' }],
        },
      },
      query: recordTransactionClientsQuery,
      variables: { id: 'company-1' },
    });

    expect(
      cache.readQuery({ query: clientsQuery, variables: { id: 'company-1' } }),
    ).toEqual({
      getClients: {
        __typename: 'Clients',
        id: 'company-1',
        items: [
          { __typename: 'Client', id: 'first', name: 'Updated first' },
          { __typename: 'Client', id: 'second', name: 'Second client' },
        ],
        nextToken: 'page-3',
      },
    });
  });
});
