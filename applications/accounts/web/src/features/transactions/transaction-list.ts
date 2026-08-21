import type { LedgerTransaction } from './TransactionLedger';

export function combineTransactions(
  confirmedTransactions: readonly LedgerTransaction[] = [],
  pendingTransactions: readonly LedgerTransaction[] = [],
) {
  // Pending is the explicit status-bearing snapshot and wins while the two
  // eventually consistent status indexes overlap.
  const transactionsById = new Map<string, LedgerTransaction>([
    ...confirmedTransactions.map((transaction): [string, LedgerTransaction] => [
      transaction.id,
      {
        ...transaction,
        status: 'confirmed',
      },
    ]),
    ...pendingTransactions.map((transaction): [string, LedgerTransaction] => [
      transaction.id,
      transaction,
    ]),
  ]);

  return [...transactionsById.values()].sort((left, right) =>
    right.date.localeCompare(left.date),
  );
}
