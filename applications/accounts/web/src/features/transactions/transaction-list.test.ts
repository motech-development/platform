import { describe, expect, it } from 'vitest';
import { combineTransactions } from './transaction-list';
import type { LedgerTransaction } from './TransactionLedger';

function transaction(
  id: string,
  date: string,
  overrides: Partial<LedgerTransaction> = {},
): LedgerTransaction {
  return {
    amount: 100,
    category: 'Sales',
    date,
    description: `Transaction ${id}`,
    id,
    name: `Company ${id}`,
    ...overrides,
  };
}

describe('combineTransactions', () => {
  it('keeps the pending snapshot when status indexes overlap', () => {
    const confirmed = transaction('shared', '2026-08-20T12:00:00.000Z', {
      description: 'Confirmed snapshot',
    });
    const pending = transaction('shared', '2026-08-21T12:00:00.000Z', {
      description: 'Pending snapshot',
      status: 'pending',
    });

    expect(combineTransactions([confirmed], [pending])).toEqual([pending]);
  });

  it('sorts combined UTC timestamps newest first', () => {
    const oldest = transaction('oldest', '2026-08-20T23:59:59.000Z');
    const newest = transaction('newest', '2026-08-21T00:00:00.000Z', {
      status: 'pending',
    });

    expect(combineTransactions([oldest], [newest]).map(({ id }) => id)).toEqual(
      ['newest', 'oldest'],
    );
  });
});
