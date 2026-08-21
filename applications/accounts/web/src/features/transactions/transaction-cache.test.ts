import { gql } from '@apollo/client';
import { createAccountsCache } from '../../data/cache';
import {
  reconcileTransactionInCache,
  removeTransactionFromCache,
} from './transaction-cache';

const transactionsQuery = gql`
  query TestTransactions(
    $count: Int
    $id: ID!
    $nextToken: String
    $status: TransactionStatus!
  ) {
    getTransactions(
      count: $count
      id: $id
      nextToken: $nextToken
      status: $status
    ) {
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
      transactionLoadedPageCount @client
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
const transactionStatusFragment = gql`
  fragment TestTransactionStatus on Transaction {
    id
    status
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
        transactionLoadedPageCount: 1,
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

    const confirmed = {
      ...pending,
      scheduled: false,
      status: 'confirmed' as const,
    };

    cache.writeFragment({
      data: confirmed,
      fragment: transactionStatusFragment,
    });
    reconcileTransactionInCache(cache, confirmed, 'pending');
    reconcileTransactionInCache(cache, confirmed, 'pending');

    expect(ids(cache, 'confirmed', 5)).toEqual(['transaction-1']);
    expect(ids(cache, 'confirmed', 100)).toEqual(['transaction-1']);
    expect(ids(cache, 'pending')).toEqual([]);
  });

  it('keeps Pending ordering oldest-first and preserves collection tokens', () => {
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
      'older',
      'transaction-1',
    ]);
    expect(collection?.getTransactions.nextToken).toBe('page-2');
  });

  it('keeps Confirmed ordering newest-first', () => {
    const cache = createAccountsCache();

    writeCollection(cache, 'confirmed', 100, [
      transaction({
        date: '2026-08-14T00:00:00.000Z',
        id: 'older',
        status: 'confirmed',
      }),
    ]);

    reconcileTransactionInCache(
      cache,
      transaction({ scheduled: false, status: 'confirmed' }),
    );

    expect(ids(cache, 'confirmed', 100)).toEqual(['transaction-1', 'older']);
  });

  it('keeps same-status edits out of loaded pages that do not contain them', () => {
    const cache = createAccountsCache();
    const latest = Array.from({ length: 5 }, (_, index) =>
      transaction({
        date: `2026-08-${(20 - index).toString().padStart(2, '0')}T00:00:00.000Z`,
        id: `latest-${index}`,
        status: 'confirmed',
      }),
    );
    const older = transaction({
      attachment: 'receipt.pdf',
      date: '2026-08-14T00:00:00.000Z',
      id: 'older',
      status: 'confirmed',
    });

    writeCollection(cache, 'confirmed', 5, latest);
    writeCollection(cache, 'confirmed', 100, [...latest, older]);

    reconcileTransactionInCache(
      cache,
      {
        ...older,
        attachment: '',
      },
      'confirmed',
    );

    expect(ids(cache, 'confirmed', 5)).toEqual(latest.map(({ id }) => id));
    expect(ids(cache, 'confirmed', 100)).toEqual([
      ...latest.map(({ id }) => id),
      'older',
    ]);
  });

  it('keeps a newly added Transaction within each loaded collection limit', () => {
    const cache = createAccountsCache();
    const existing = Array.from({ length: 5 }, (_, index) =>
      transaction({
        date: `2026-08-${(19 - index).toString().padStart(2, '0')}T00:00:00.000Z`,
        id: `existing-${index}`,
        status: 'confirmed',
      }),
    );

    writeCollection(cache, 'confirmed', 5, existing);

    reconcileTransactionInCache(
      cache,
      transaction({
        date: '2026-08-20T00:00:00.000Z',
        id: 'newest',
        status: 'confirmed',
      }),
    );

    expect(ids(cache, 'confirmed', 5)).toEqual([
      'newest',
      'existing-0',
      'existing-1',
      'existing-2',
      'existing-3',
    ]);
  });

  it('preserves the extent of every loaded page during reconciliation', () => {
    const cache = createAccountsCache();
    const existing = Array.from({ length: 4 }, (_, index) =>
      transaction({
        date: `2026-08-${(19 - index).toString().padStart(2, '0')}T00:00:00.000Z`,
        id: `existing-${index}`,
        status: 'confirmed',
      }),
    );

    writeCollection(cache, 'confirmed', 2, existing.slice(0, 2));
    cache.writeQuery({
      data: {
        getTransactions: {
          __typename: 'Transactions',
          id: companyId,
          items: existing.slice(2),
          nextToken: null,
          status: 'confirmed',
          transactionLoadedPageCount: 2,
        },
      },
      query: transactionsQuery,
      variables: {
        count: 2,
        id: companyId,
        nextToken: 'page-2',
        status: 'confirmed',
      },
    });

    reconcileTransactionInCache(
      cache,
      transaction({
        date: '2026-08-20T00:00:00.000Z',
        id: 'newest',
        status: 'confirmed',
      }),
    );

    expect(ids(cache, 'confirmed', 2)).toEqual([
      'newest',
      'existing-0',
      'existing-1',
      'existing-2',
    ]);
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

  it('adds sale suggestions in display order without changing purchase suggestions', () => {
    const cache = createAccountsCache();

    cache.writeQuery({
      data: {
        getTypeahead: {
          __typename: 'Typeahead',
          id: companyId,
          purchases: ['Existing purchase'],
          sales: ['Zulu work', 'Alpha work'],
          suppliers: ['Existing supplier'],
        },
      },
      query: typeaheadQuery,
      variables: { id: companyId },
    });

    reconcileTransactionInCache(
      cache,
      transaction({
        category: 'Sales',
        description: 'Beta work',
        name: 'New client',
        status: 'confirmed',
      }),
    );

    expect(
      cache.readQuery({ query: typeaheadQuery, variables: { id: companyId } }),
    ).toEqual({
      getTypeahead: {
        __typename: 'Typeahead',
        id: companyId,
        purchases: ['Existing purchase'],
        sales: ['Alpha work', 'Beta work', 'Zulu work'],
        suppliers: ['Existing supplier'],
      },
    });
  });

  it('leaves collections belonging to another company unchanged', () => {
    const cache = createAccountsCache();
    const otherCompanyTransaction = transaction({
      companyId: 'company-2',
      id: 'other-transaction',
      status: 'confirmed',
    });

    cache.writeQuery({
      data: {
        getTransactions: {
          __typename: 'Transactions',
          id: 'company-2',
          items: [otherCompanyTransaction],
          nextToken: null,
          status: 'confirmed',
        },
      },
      query: transactionsQuery,
      variables: { count: 100, id: 'company-2', status: 'confirmed' },
    });

    reconcileTransactionInCache(
      cache,
      transaction({ scheduled: false, status: 'confirmed' }),
    );

    expect(
      cache
        .readQuery<{ getTransactions: { items: Array<{ id: string }> } }>({
          query: transactionsQuery,
          variables: { count: 100, id: 'company-2', status: 'confirmed' },
        })
        ?.getTransactions.items.map(({ id }) => id),
    ).toEqual(['other-transaction']);
  });

  it('does not modify collections when Apollo cannot create a Transaction reference', () => {
    const cache = {
      modify: vi.fn(),
      writeFragment: vi.fn(() => undefined),
    };

    reconcileTransactionInCache(cache as never, transaction());

    expect(cache.modify).not.toHaveBeenCalled();
  });

  it('preserves unresolved Typeahead fields until Apollo resolves them', () => {
    const unresolved = { __ref: 'Typeahead:unresolved' };
    const cache = {
      identify: vi.fn(() => 'Typeahead:company-1'),
      modify: vi.fn(
        ({
          fields,
          id,
        }: {
          fields: Record<string, (existing: unknown) => unknown>;
          id: string;
        }) => {
          if (id === 'ROOT_QUERY') return;

          expect(fields.purchases?.(unresolved)).toBe(unresolved);
          expect(fields.sales?.(unresolved)).toBe(unresolved);
          expect(fields.suppliers?.(unresolved)).toBe(unresolved);
        },
      ),
      writeFragment: vi.fn(() => ({ __ref: 'Transaction:transaction-1' })),
    };

    reconcileTransactionInCache(cache as never, transaction());

    expect(cache.modify).toHaveBeenCalledTimes(2);
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
