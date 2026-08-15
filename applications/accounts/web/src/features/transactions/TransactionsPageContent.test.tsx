import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TransactionsPageContent } from './TransactionsPageContent';

const mocks = vi.hoisted(() => ({
  confirmedError: undefined as Error | undefined,
  confirmedFetchMore: vi.fn().mockResolvedValue(undefined),
  pendingError: undefined as Error | undefined,
  pendingFetchMore: vi.fn().mockResolvedValue(undefined),
  queryCall: 0,
}));

vi.mock('@apollo/client/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client/react')>()),
  useQuery: () => {
    const confirmed = mocks.queryCall % 2 === 0;

    mocks.queryCall += 1;

    return {
      data: {
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
              id: confirmed ? 'confirmed-id' : 'pending-id',
              name: confirmed ? 'Client' : 'Supplier',
              ...(confirmed ? {} : { status: 'pending' }),
            },
          ],
          nextToken: confirmed ? 'confirmed-next' : null,
        },
      },
      error: confirmed ? mocks.confirmedError : mocks.pendingError,
      fetchMore: confirmed ? mocks.confirmedFetchMore : mocks.pendingFetchMore,
      loading: false,
      networkStatus: undefined,
      refetch: vi.fn(),
    };
  },
}));

vi.mock('./FinancialSummary', () => ({
  FinancialSummary: () => <p>Financial summary</p>,
}));

vi.mock('./TransactionLedger', () => ({
  TransactionLedger: ({ transactions }: { transactions: { id: string }[] }) => (
    <p>{transactions.map(({ id }) => id).join(',')}</p>
  ),
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
    mocks.pendingError = undefined;
    vi.clearAllMocks();
  });

  it('combines Pending and Confirmed Transactions newest first and paginates each source', async () => {
    render(
      <BreezeProvider locale="en-GB">
        <TransactionsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    expect(screen.getByText('pending-id,confirmed-id')).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Load more' }));

    expect(mocks.confirmedFetchMore).toHaveBeenCalledWith({
      variables: { nextToken: 'confirmed-next' },
    });
    expect(mocks.pendingFetchMore).not.toHaveBeenCalled();
  });

  it('keeps available Transactions visible after a partial refresh failure', () => {
    mocks.pendingError = new Error('Pending refresh failed');

    render(
      <BreezeProvider locale="en-GB">
        <TransactionsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    expect(screen.getByText('pending-id,confirmed-id')).toBeVisible();
    expect(
      screen.getByText(
        'Transactions could not be refreshed. Existing results are still shown.',
      ),
    ).toBeVisible();
    expect(screen.queryByText('Could not load')).not.toBeInTheDocument();
  });
});
