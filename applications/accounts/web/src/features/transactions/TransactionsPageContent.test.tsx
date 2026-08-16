import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TransactionsPageContent } from './TransactionsPageContent';

const mocks = vi.hoisted(() => ({
  confirmedError: undefined as Error | undefined,
  confirmedFetchMore: vi.fn().mockResolvedValue(undefined),
  confirmedHasData: true,
  confirmedId: 'confirmed-id',
  confirmedLoading: false,
  pendingError: undefined as Error | undefined,
  pendingFetchMore: vi.fn().mockResolvedValue(undefined),
  pendingHasData: true,
  pendingId: 'pending-id',
  pendingLoading: false,
  queryCall: 0,
}));

vi.mock('@apollo/client/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client/react')>()),
  useQuery: () => {
    const confirmed = mocks.queryCall % 2 === 0;

    mocks.queryCall += 1;

    return {
      data: (confirmed ? mocks.confirmedHasData : mocks.pendingHasData)
        ? {
            getBalance: {
              balance: 0,
              currency: 'GBP',
              vat: { owed: 0, paid: 0 },
            },
            getTransactions: {
              items: [
                {
                  amount: confirmed ? 100 : -20,
                  category: confirmed ? 'Sales' : 'Professional fees',
                  date: confirmed
                    ? '2026-08-15T00:00:00.000Z'
                    : '2026-08-16T00:00:00.000Z',
                  description: confirmed ? 'Confirmed work' : 'Pending work',
                  id: confirmed ? mocks.confirmedId : mocks.pendingId,
                  name: confirmed ? 'Client' : 'Supplier',
                  ...(confirmed ? {} : { status: 'pending' }),
                },
              ],
              nextToken: confirmed ? 'confirmed-next' : null,
            },
          }
        : undefined,
      error: confirmed ? mocks.confirmedError : mocks.pendingError,
      fetchMore: confirmed ? mocks.confirmedFetchMore : mocks.pendingFetchMore,
      loading: confirmed ? mocks.confirmedLoading : mocks.pendingLoading,
      networkStatus: undefined,
      refetch: vi.fn(),
    };
  },
}));

vi.mock('./FinancialSummary', () => ({
  FinancialSummary: () => <p>Financial summary</p>,
  FinancialSummarySkeleton: () => <p>Financial summary skeleton</p>,
}));

vi.mock('./TransactionLedger', () => ({
  TransactionLedger: ({
    transactions,
  }: {
    transactions: { id: string; status: string }[];
  }) => (
    <p>{transactions.map(({ id, status }) => `${id}:${status}`).join(',')}</p>
  ),
  TransactionLedgerSkeleton: () => <p>Transaction ledger skeleton</p>,
}));

vi.mock('./TransactionPagePresentation', () => ({
  RecordTransactionLink: () => <a href="/record">Record transaction</a>,
  TransactionPageError: () => <p>Could not load</p>,
  TransactionPageHeaderAction: () => null,
}));

describe('TransactionsPageContent', () => {
  beforeEach(() => {
    mocks.queryCall = 0;
    mocks.confirmedError = undefined;
    mocks.confirmedHasData = true;
    mocks.confirmedId = 'confirmed-id';
    mocks.confirmedLoading = false;
    mocks.pendingError = undefined;
    mocks.pendingHasData = true;
    mocks.pendingId = 'pending-id';
    mocks.pendingLoading = false;
    vi.clearAllMocks();
  });

  it('combines Pending and Confirmed Transactions newest first and paginates each source', async () => {
    render(
      <BreezeProvider locale="en-GB">
        <TransactionsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    expect(
      screen.getByText('pending-id:pending,confirmed-id:confirmed'),
    ).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Load more' }));

    expect(mocks.confirmedFetchMore).toHaveBeenCalledWith({
      variables: { nextToken: 'confirmed-next' },
    });
    expect(mocks.pendingFetchMore).not.toHaveBeenCalled();
  });

  it('deduplicates overlapping status snapshots with Pending precedence', () => {
    mocks.confirmedId = 'shared-id';
    mocks.pendingId = 'shared-id';

    render(
      <BreezeProvider locale="en-GB">
        <TransactionsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    expect(screen.getByText('shared-id:pending')).toBeVisible();
    expect(
      screen.queryByText(/shared-id:.*shared-id/u),
    ).not.toBeInTheDocument();
  });

  it('keeps available Transactions visible after a partial refresh failure', () => {
    mocks.pendingError = new Error('Pending refresh failed');

    render(
      <BreezeProvider locale="en-GB">
        <TransactionsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    expect(
      screen.getByText('pending-id:pending,confirmed-id:confirmed'),
    ).toBeVisible();
    expect(
      screen.getByText(
        'Transactions could not be refreshed. Existing results are still shown.',
      ),
    ).toBeVisible();
    expect(screen.queryByText('Could not load')).not.toBeInTheDocument();
  });

  it('shows only the loading layout until both transaction sources have initial data', () => {
    mocks.pendingHasData = false;
    mocks.pendingLoading = true;

    render(
      <BreezeProvider locale="en-GB">
        <TransactionsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    expect(
      screen.getByRole('status', { name: 'Loading transactions' }),
    ).toBeVisible();
    expect(screen.queryByText('confirmed-id')).not.toBeInTheDocument();
    expect(screen.queryByText('Financial summary')).not.toBeInTheDocument();
  });
});
