import type { ApolloCache } from '@apollo/client';
import {
  GET_COMPANY_DASHBOARD,
  GET_CONFIRMED_TRANSACTIONS,
} from '../../data/operations';
import type { AccountsWebDashboardQuery } from '../../graphql/graphql';

export interface ConfirmedTransactionCacheValue {
  readonly __typename?: 'Transaction';
  readonly amount: number;
  readonly attachment: string;
  readonly category: string;
  readonly companyId: string;
  readonly date: string;
  readonly description: string;
  readonly id: string;
  readonly name: string;
  readonly refund: boolean;
  readonly scheduled: boolean;
  readonly status: 'confirmed';
  readonly vat: number;
}

function ledgerTransaction(transaction: ConfirmedTransactionCacheValue) {
  const { amount, attachment, category, date, description, id, name } =
    transaction;

  return {
    __typename: 'Transaction' as const,
    amount,
    attachment,
    category,
    date,
    description,
    id,
    name,
  };
}

function addToLedger<
  Transaction extends { readonly date: string; readonly id: string },
>(items: readonly Transaction[], transaction: Transaction) {
  return [...items.filter(({ id }) => id !== transaction.id), transaction].sort(
    (left, right) => right.date.localeCompare(left.date),
  );
}

type ConfirmedLedgerItem =
  AccountsWebDashboardQuery['getTransactions']['items'][number];

function addTransactionToLedger(transaction: ConfirmedLedgerItem) {
  return <
    Query extends {
      getTransactions: {
        items: ConfirmedLedgerItem[];
      };
    },
  >(
    current: Query | null | undefined,
  ) => {
    if (!current) {
      return current;
    }

    return {
      ...current,
      getTransactions: {
        ...current.getTransactions,
        items: addToLedger(current.getTransactions.items, transaction),
      },
    };
  };
}

export function addConfirmedTransactionToCache(
  cache: ApolloCache,
  transaction: ConfirmedTransactionCacheValue,
) {
  const sharedVariables = {
    id: transaction.companyId,
    status: 'confirmed' as const,
  };
  const item = ledgerTransaction(transaction);
  const updateLedger = addTransactionToLedger(item);

  cache.updateQuery(
    {
      query: GET_COMPANY_DASHBOARD,
      variables: { ...sharedVariables, count: 5 },
    },
    updateLedger,
  );

  cache.updateQuery(
    {
      query: GET_CONFIRMED_TRANSACTIONS,
      variables: { ...sharedVariables, count: 100 },
    },
    updateLedger,
  );
}
