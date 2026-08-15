import {
  type ApolloCache,
  gql,
  type Reference,
  type StoreObject,
} from '@apollo/client';
import { isSaleTransactionCategory } from './transaction';

export interface TransactionCacheValue {
  readonly __typename?: 'Transaction';
  readonly amount: number;
  readonly attachment?: string | null;
  readonly category: string;
  readonly companyId: string;
  readonly date: string;
  readonly description: string;
  readonly id: string;
  readonly name: string;
  readonly refund: boolean;
  readonly scheduled: boolean;
  readonly status: 'confirmed' | 'pending';
  readonly vat: number;
}

const transactionFragment = gql`
  fragment TransactionCacheValue on Transaction {
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
`;

function sortedUnique(values: readonly string[], incoming: string) {
  return values.some(
    (value) =>
      value.localeCompare(incoming, 'en-GB', { sensitivity: 'base' }) === 0,
  )
    ? values
    : [...values, incoming].sort((left, right) =>
        left.localeCompare(right, 'en-GB', { sensitivity: 'base' }),
      );
}

function isStringArray(value: unknown): value is readonly string[] {
  return (
    Array.isArray(value) &&
    value.every((item: unknown) => typeof item === 'string')
  );
}

function updateSuggestions(
  cache: ApolloCache,
  transaction: TransactionCacheValue,
) {
  const typeaheadId = cache.identify({
    __typename: 'Typeahead',
    id: transaction.companyId,
  });

  if (!typeaheadId) return;

  const sale = isSaleTransactionCategory(transaction.category);

  cache.modify({
    fields: {
      purchases(existing: readonly string[] | Reference = []) {
        if (!isStringArray(existing)) {
          return existing;
        }

        return sale
          ? existing
          : sortedUnique(existing, transaction.description);
      },
      sales(existing: readonly string[] | Reference = []) {
        if (!isStringArray(existing)) {
          return existing;
        }

        return sale
          ? sortedUnique(existing, transaction.description)
          : existing;
      },
      suppliers(existing: readonly string[] | Reference = []) {
        if (!isStringArray(existing)) {
          return existing;
        }

        return sale ? existing : sortedUnique(existing, transaction.name);
      },
    },
    id: typeaheadId,
  });
}

function updateLoadedCollections(
  cache: ApolloCache,
  companyId: string,
  transactionId: string,
  target?: Readonly<{
    reference: Reference;
    status: 'confirmed' | 'pending';
  }>,
) {
  cache.modify({
    fields: {
      getTransactions(
        existing: Reference | StoreObject | undefined,
        { readField },
      ) {
        if (!existing || readField<string>('id', existing) !== companyId) {
          return existing;
        }

        const status = readField<'confirmed' | 'pending'>('status', existing);
        const items = readField<readonly Reference[]>('items', existing) ?? [];
        const retained = items.filter(
          (item) => readField<string>('id', item) !== transactionId,
        );

        if (!target || status !== target.status) {
          return retained.length === items.length
            ? existing
            : { ...existing, items: retained };
        }

        const next = [...retained, target.reference].sort((left, right) => {
          const leftDate = readField<string>('date', left) ?? '';
          const rightDate = readField<string>('date', right) ?? '';

          return rightDate.localeCompare(leftDate);
        });

        return { ...existing, items: next };
      },
    },
    id: 'ROOT_QUERY',
  });
}

export function reconcileTransactionInCache(
  cache: ApolloCache,
  transaction: TransactionCacheValue,
) {
  const reference = cache.writeFragment({
    data: { ...transaction, __typename: 'Transaction' },
    fragment: transactionFragment,
  });

  if (!reference) return;

  updateLoadedCollections(cache, transaction.companyId, transaction.id, {
    reference,
    status: transaction.status,
  });
  updateSuggestions(cache, transaction);
}

export function removeTransactionFromCache(
  cache: ApolloCache,
  companyId: string,
  transactionId: string,
) {
  updateLoadedCollections(cache, companyId, transactionId);
  cache.evict({
    id: cache.identify({ __typename: 'Transaction', id: transactionId }),
  });
  cache.gc();
}
