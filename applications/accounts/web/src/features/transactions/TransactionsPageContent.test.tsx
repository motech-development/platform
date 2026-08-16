import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TransactionsPageContent } from './TransactionsPageContent';

const mocks = vi.hoisted(() => ({
  confirmedError: undefined as Error | undefined,
  confirmedFetchMore: vi.fn().mockResolvedValue(undefined),
  confirmedHasData: true,
  confirmedHasItems: true,
  confirmedId: 'confirmed-id',
  confirmedLoading: false,
  confirmedNextToken: null as string | null,
  confirmedRefetch: vi.fn().mockResolvedValue(undefined),
  pendingError: undefined as Error | undefined,
  pendingFetchMore: vi.fn().mockResolvedValue(undefined),
  pendingHasData: true,
  pendingHasItems: true,
  pendingId: 'pending-id',
  pendingLoading: false,
  pendingNextToken: null as string | null,
  pendingRefetch: vi.fn().mockResolvedValue(undefined),
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
              items: (
                confirmed ? mocks.confirmedHasItems : mocks.pendingHasItems
              )
                ? [
                    {
                      amount: confirmed ? 100 : -20,
                      category: confirmed ? 'Sales' : 'Professional fees',
                      date: confirmed
                        ? '2026-08-15T00:00:00.000Z'
                        : '2026-08-16T00:00:00.000Z',
                      description: confirmed
                        ? 'Confirmed work'
                        : 'Pending work',
                      id: confirmed ? mocks.confirmedId : mocks.pendingId,
                      name: confirmed ? 'Client' : 'Supplier',
                      ...(confirmed ? {} : { status: 'pending' }),
                    },
                  ]
                : [],
              nextToken: confirmed
                ? mocks.confirmedNextToken
                : mocks.pendingNextToken,
            },
          }
        : undefined,
      error: confirmed ? mocks.confirmedError : mocks.pendingError,
      fetchMore: confirmed ? mocks.confirmedFetchMore : mocks.pendingFetchMore,
      loading: confirmed ? mocks.confirmedLoading : mocks.pendingLoading,
      networkStatus: undefined,
      refetch: confirmed ? mocks.confirmedRefetch : mocks.pendingRefetch,
    };
  },
}));

vi.mock('@motech-development/breeze-ui/icons', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('@motech-development/breeze-ui/icons')
  >()),
  ArrowRightIcon: () => <svg aria-hidden="true" />,
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
  TransactionPageError: ({ onRetry }: { onRetry: () => Promise<unknown> }) => (
    <button
      onClick={() => {
        onRetry().catch(() => undefined);
      }}
      type="button"
    >
      Could not load
    </button>
  ),
  TransactionPageHeaderAction: () => null,
}));

describe('TransactionsPageContent', () => {
  beforeEach(() => {
    mocks.queryCall = 0;
    mocks.confirmedError = undefined;
    mocks.confirmedHasData = true;
    mocks.confirmedHasItems = true;
    mocks.confirmedId = 'confirmed-id';
    mocks.confirmedLoading = false;
    mocks.confirmedNextToken = 'confirmed-next';
    mocks.pendingError = undefined;
    mocks.pendingHasData = true;
    mocks.pendingHasItems = true;
    mocks.pendingId = 'pending-id';
    mocks.pendingLoading = false;
    mocks.pendingNextToken = null;
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

  it('waits for Confirmed Transactions when Pending data arrives first', () => {
    mocks.confirmedHasData = false;
    mocks.confirmedLoading = true;

    render(
      <BreezeProvider locale="en-GB">
        <TransactionsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    expect(
      screen.getByRole('status', { name: 'Loading transactions' }),
    ).toBeVisible();
    expect(screen.queryByText('pending-id')).not.toBeInTheDocument();
  });

  it('offers recovery when neither transaction source has initial data', async () => {
    mocks.confirmedError = new Error('Confirmed unavailable');
    mocks.confirmedHasData = false;
    mocks.pendingHasData = false;

    render(
      <BreezeProvider locale="en-GB">
        <TransactionsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Could not load' }),
    );

    expect(mocks.confirmedRefetch).toHaveBeenCalledOnce();
    expect(mocks.pendingRefetch).toHaveBeenCalledOnce();
  });

  it('retries both sources after a failed partial refresh', async () => {
    mocks.pendingError = new Error('Pending refresh failed');
    mocks.pendingRefetch.mockRejectedValueOnce(new Error('Still unavailable'));

    render(
      <BreezeProvider locale="en-GB">
        <TransactionsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(mocks.confirmedRefetch).toHaveBeenCalledOnce();
    expect(mocks.pendingRefetch).toHaveBeenCalledOnce();
  });

  it('uses Pending balance context when Confirmed data is unavailable', () => {
    mocks.confirmedHasData = false;

    render(
      <BreezeProvider locale="en-GB">
        <TransactionsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    expect(screen.getByText('pending-id:pending')).toBeVisible();
    expect(screen.queryByText('Financial summary')).not.toBeInTheDocument();
  });

  it('loads whichever transaction sources expose another page', async () => {
    mocks.confirmedNextToken = null;
    mocks.pendingNextToken = 'pending-next';
    mocks.pendingFetchMore.mockRejectedValueOnce(new Error('Page unavailable'));

    render(
      <BreezeProvider locale="en-GB">
        <TransactionsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Load more' }));

    expect(mocks.confirmedFetchMore).not.toHaveBeenCalled();
    expect(mocks.pendingFetchMore).toHaveBeenCalledWith({
      variables: { nextToken: 'pending-next' },
    });
  });

  it('presents the empty collection action after both sources resolve', () => {
    mocks.confirmedHasItems = false;
    mocks.confirmedNextToken = null;
    mocks.pendingHasItems = false;

    render(
      <BreezeProvider locale="en-GB">
        <TransactionsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    expect(screen.getByText('No transactions yet')).toBeVisible();
    expect(
      screen.getByRole('link', { name: 'Record transaction' }),
    ).toBeVisible();
  });
});
