import { gql } from '@apollo/client';
import { createAccountsCache } from '../../data/cache';
import {
  reconcileTransactionInCache,
  removeTransactionFromCache,
} from './transaction-cache';

const transactionsQuery = gql`
  query TestTransactions($count: Int, $id: ID!, $status: TransactionStatus!) {
    getTransactions(count: $count, id: $id, status: $status) {
      id
      items {
        amount
        attachment
        category
        companyId
        date
        description
        id
        name
        refund
        scheduled
        status
        vat
      }
      nextToken
      status
    }
  }
`;
const typeaheadQuery = gql`
  query TestTypeahead($id: ID!) {
    getTypeahead(id: $id) {
      id
      purchases
      sales
      suppliers
    }
  }
`;
const companyId = 'company-1';
const transaction = (overrides: Record<string, unknown> = {}) => ({
  __typename: 'Transaction' as const,
  amount: -120,
  attachment: '',
  category: 'Professional fees',
  companyId,
  date: '2026-08-15T00:00:00.000Z',
  description: 'Quarterly bookkeeping',
  id: 'transaction-1',
  name: 'Oak & Co Accountants',
  refund: false,
  scheduled: true,
  status: 'pending' as const,
  vat: 20,
  ...overrides,
});

function writeCollection(
  cache: ReturnType<typeof createAccountsCache>,
  status: 'confirmed' | 'pending',
  count: number | undefined,
  items: ReturnType<typeof transaction>[],
) {
  cache.writeQuery({
    data: {
      getTransactions: {
        __typename: 'Transactions',
        id: companyId,
        items,
        nextToken: null,
        status,
      },
    },
    query: transactionsQuery,
    variables: { count, id: companyId, status },
  });
}

function ids(
  cache: ReturnType<typeof createAccountsCache>,
  status: 'confirmed' | 'pending',
  count?: number,
) {
  return cache
    .readQuery<{ getTransactions: { items: Array<{ id: string }> } }>({
      query: transactionsQuery,
      variables: { count, id: companyId, status },
    })
    ?.getTransactions.items.map(({ id }) => id);
}

describe('Transaction cache reconciliation', () => {
  it('moves a Transaction to every loaded target collection and removes it from the old status', () => {
    const cache = createAccountsCache();
    const pending = transaction();

    writeCollection(cache, 'confirmed', 5, []);
    writeCollection(cache, 'confirmed', 100, []);
    writeCollection(cache, 'pending', undefined, [pending]);

    reconcileTransactionInCache(cache, {
      ...pending,
      scheduled: false,
      status: 'confirmed',
    });
    reconcileTransactionInCache(cache, {
      ...pending,
      scheduled: false,
      status: 'confirmed',
    });

    expect(ids(cache, 'confirmed', 5)).toEqual(['transaction-1']);
    expect(ids(cache, 'confirmed', 100)).toEqual(['transaction-1']);
    expect(ids(cache, 'pending')).toEqual([]);
  });

  it('keeps newest-first ordering stable and preserves collection tokens', () => {
    const cache = createAccountsCache();

    cache.writeQuery({
      data: {
        getTransactions: {
          __typename: 'Transactions',
          id: companyId,
          items: [
            transaction({
              date: '2026-08-14T00:00:00.000Z',
              id: 'older',
            }),
          ],
          nextToken: 'page-2',
          status: 'pending',
        },
      },
      query: transactionsQuery,
      variables: { count: undefined, id: companyId, status: 'pending' },
    });

    reconcileTransactionInCache(cache, transaction());

    const collection = cache.readQuery<{
      getTransactions: { items: Array<{ id: string }>; nextToken: string };
    }>({
      query: transactionsQuery,
      variables: { count: undefined, id: companyId, status: 'pending' },
    });

    expect(collection?.getTransactions.items.map(({ id }) => id)).toEqual([
      'transaction-1',
      'older',
    ]);
    expect(collection?.getTransactions.nextToken).toBe('page-2');
  });

  it('adds purchase suggestions without duplicates', () => {
    const cache = createAccountsCache();

    cache.writeQuery({
      data: {
        getTypeahead: {
          __typename: 'Typeahead',
          id: companyId,
          purchases: ['quarterly bookkeeping'],
          sales: [],
          suppliers: ['oak & co accountants'],
        },
      },
      query: typeaheadQuery,
      variables: { id: companyId },
    });

    reconcileTransactionInCache(cache, transaction());
    reconcileTransactionInCache(cache, transaction());

    expect(
      cache.readQuery({ query: typeaheadQuery, variables: { id: companyId } }),
    ).toEqual({
      getTypeahead: {
        __typename: 'Typeahead',
        id: companyId,
        purchases: ['quarterly bookkeeping'],
        sales: [],
        suppliers: ['oak & co accountants'],
      },
    });
  });

  it('removes a deleted Transaction from every loaded collection', () => {
    const cache = createAccountsCache();
    const item = transaction();

    writeCollection(cache, 'confirmed', 100, [item]);
    writeCollection(cache, 'pending', undefined, [item]);

    removeTransactionFromCache(cache, companyId, item.id);

    expect(ids(cache, 'confirmed', 100)).toEqual([]);
    expect(ids(cache, 'pending')).toEqual([]);
  });
});
