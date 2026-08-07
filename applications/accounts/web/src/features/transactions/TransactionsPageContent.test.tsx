import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TransactionsPageContent } from './TransactionsPageContent';

const queryState = vi.hoisted(() => ({
  current: {
    data: {
      getBalance: { balance: 0, currency: 'GBP', vat: 0 },
      getTransactions: { items: [{}], nextToken: 'next-page' },
    },
    error: undefined,
    fetchMore: vi.fn().mockResolvedValue(undefined),
    loading: false,
    networkStatus: undefined,
    refetch: vi.fn(),
  },
}));

vi.mock('@apollo/client/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client/react')>()),
  useQuery: () => queryState.current,
}));

vi.mock('./FinancialSummary', () => ({
  FinancialSummary: () => <p>Financial summary</p>,
}));

vi.mock('./TransactionLedger', () => ({
  TransactionLedger: () => <p>Transaction ledger</p>,
}));

vi.mock('./TransactionPagePresentation', () => ({
  RecordTransactionLink: () => <a href="/record">Record transaction</a>,
  TransactionPageError: () => <p>Could not load</p>,
  TransactionPageHeaderAction: () => null,
}));

describe('TransactionsPageContent', () => {
  it('loads the next page exposed by the ledger query', async () => {
    render(
      <BreezeProvider locale="en-GB">
        <TransactionsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Load more' }));

    expect(queryState.current.fetchMore).toHaveBeenCalledWith({
      variables: { nextToken: 'next-page' },
    });
  });
});
