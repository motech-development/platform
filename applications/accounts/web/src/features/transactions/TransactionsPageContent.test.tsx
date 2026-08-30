import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TransactionsPageContent } from './TransactionsPageContent';

const mocks = vi.hoisted(() => ({
  confirmedError: undefined as Error | undefined,
  confirmedFetchMore: vi.fn().mockResolvedValue(undefined),
  confirmedHasData: true,
  confirmedHasItems: true,
  confirmedId: 'confirmed-id',
  confirmedLoadedPageCount: 1,
  confirmedLoading: false,
  confirmedNextToken: null as string | null,
  confirmedRefetch: vi.fn().mockResolvedValue(undefined),
  confirmedRefreshGeneration: 0,
  confirmedRequestedPageCount: 1,
  pendingError: undefined as Error | undefined,
  pendingFetchMore: vi.fn().mockResolvedValue(undefined),
  pendingHasData: true,
  pendingHasItems: true,
  pendingId: 'pending-id',
  pendingLoadedPageCount: 1,
  pendingLoading: false,
  pendingNextToken: null as string | null,
  pendingRefetch: vi.fn().mockResolvedValue(undefined),
  pendingRefreshGeneration: 0,
  pendingRequestedPageCount: 1,
}));

vi.mock('@apollo/client/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client/react')>()),
  useQuery: (
    _document: unknown,
    { variables }: { variables: { status: string } },
  ) => {
    const confirmed = variables.status === 'confirmed';

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
              transactionLoadedPageCount: confirmed
                ? mocks.confirmedLoadedPageCount
                : mocks.pendingLoadedPageCount,
              transactionRefreshGeneration: confirmed
                ? mocks.confirmedRefreshGeneration
                : mocks.pendingRefreshGeneration,
              transactionRequestedPageCount: confirmed
                ? mocks.confirmedRequestedPageCount
                : mocks.pendingRequestedPageCount,
            },
          }
        : undefined,
      error: confirmed ? mocks.confirmedError : mocks.pendingError,
      fetchMore: confirmed ? mocks.confirmedFetchMore : mocks.pendingFetchMore,
      loading: confirmed ? mocks.confirmedLoading : mocks.pendingLoading,
      networkStatus: 7,
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
  RecordTransactionLink: ({ icon = true }: { icon?: boolean }) => (
    <a href="/record">
      {icon ? <svg aria-hidden="true" /> : null}
      Record transaction
    </a>
  ),
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
    vi.resetAllMocks();
    mocks.confirmedFetchMore.mockResolvedValue(undefined);
    mocks.confirmedRefetch.mockResolvedValue(undefined);
    mocks.pendingFetchMore.mockResolvedValue(undefined);
    mocks.pendingRefetch.mockResolvedValue(undefined);
    mocks.confirmedError = undefined;
    mocks.confirmedHasData = true;
    mocks.confirmedHasItems = true;
    mocks.confirmedId = 'confirmed-id';
    mocks.confirmedLoading = false;
    mocks.confirmedNextToken = 'confirmed-next';
    mocks.confirmedLoadedPageCount = 1;
    mocks.confirmedRefreshGeneration = 0;
    mocks.confirmedRequestedPageCount = 1;
    mocks.pendingError = undefined;
    mocks.pendingHasData = true;
    mocks.pendingHasItems = true;
    mocks.pendingId = 'pending-id';
    mocks.pendingLoading = false;
    mocks.pendingNextToken = null;
    mocks.pendingLoadedPageCount = 1;
    mocks.pendingRefreshGeneration = 0;
    mocks.pendingRequestedPageCount = 1;
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

  it('does not claim the collection is empty when one source fails initially', () => {
    mocks.confirmedHasItems = false;
    mocks.confirmedNextToken = null;
    mocks.pendingError = new Error('Pending unavailable');
    mocks.pendingHasData = false;

    render(
      <BreezeProvider locale="en-GB">
        <TransactionsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    expect(screen.queryByText('No transactions yet')).not.toBeInTheDocument();
    expect(
      screen.getByText(
        'Transactions could not be refreshed. Check your connection, then try again.',
      ),
    ).toBeVisible();
    expect(
      screen.queryByRole('link', { name: 'Record transaction' }),
    ).not.toBeInTheDocument();
  });

  it('shows only the loading layout until both transaction sources have initial data', () => {
    mocks.confirmedError = new Error('Confirmed refresh failed');
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
    expect(
      screen.queryByText(
        'Transactions could not be refreshed. Existing results are still shown.',
      ),
    ).not.toBeInTheDocument();
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
    mocks.pendingError = new Error('Pending unavailable');
    mocks.pendingHasData = false;

    render(
      <BreezeProvider locale="en-GB">
        <TransactionsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Could not load' }),
    );

    expect(
      screen.queryByRole('status', { name: 'Loading transactions' }),
    ).not.toBeInTheDocument();
    expect(mocks.confirmedRefetch).toHaveBeenCalledOnce();
    expect(mocks.pendingRefetch).toHaveBeenCalledOnce();
  });

  it('keeps loading when one source fails before the other settles', () => {
    mocks.confirmedError = new Error('Confirmed unavailable');
    mocks.confirmedHasData = false;
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
    expect(screen.queryByText('Could not load')).not.toBeInTheDocument();
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
    expect(
      await screen.findByText(
        'More transactions could not be loaded. Existing results are still shown.',
      ),
    ).toBeVisible();

    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(mocks.pendingFetchMore).toHaveBeenCalledTimes(2);
    expect(mocks.confirmedFetchMore).not.toHaveBeenCalled();
  });

  it('reports and retries a failed page-depth reconciliation', async () => {
    mocks.confirmedNextToken = 'confirmed-refreshed-page-2';
    mocks.confirmedRefreshGeneration = 1;
    mocks.confirmedRequestedPageCount = 2;
    mocks.confirmedFetchMore.mockRejectedValueOnce(
      new Error('Page unavailable'),
    );

    render(
      <BreezeProvider locale="en-GB">
        <TransactionsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    expect(
      await screen.findByText(
        'More transactions could not be loaded. Existing results are still shown.',
      ),
    ).toBeVisible();

    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));

    await waitFor(() =>
      expect(mocks.confirmedFetchMore).toHaveBeenCalledTimes(2),
    );
  });

  it('rebuilds each source to its previously loaded depth after refresh', async () => {
    mocks.confirmedNextToken = 'confirmed-refreshed-page-2';
    mocks.confirmedRefreshGeneration = 1;
    mocks.confirmedRequestedPageCount = 2;
    mocks.pendingNextToken = 'pending-refreshed-page-2';
    mocks.pendingRefreshGeneration = 1;
    mocks.pendingRequestedPageCount = 2;

    render(
      <BreezeProvider locale="en-GB">
        <TransactionsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    await waitFor(() => {
      expect(mocks.confirmedFetchMore).toHaveBeenCalledWith({
        variables: { nextToken: 'confirmed-refreshed-page-2' },
      });
      expect(mocks.pendingFetchMore).toHaveBeenCalledWith({
        variables: { nextToken: 'pending-refreshed-page-2' },
      });
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
      screen.getByText('Record money coming in or going out of the business.'),
    ).toBeVisible();
    const action = screen.getByRole('link', { name: 'Record transaction' });

    expect(action).toBeVisible();
    expect(action.querySelector('svg')).not.toBeInTheDocument();
  });
});
