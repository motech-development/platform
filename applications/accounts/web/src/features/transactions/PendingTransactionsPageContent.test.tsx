import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PendingTransactionsPageContent } from './PendingTransactionsPageContent';

const query = vi.hoisted(() => ({
  data: {
    getBalance: { currency: 'GBP', id: 'company-id' },
    getTransactions: {
      items: [
        {
          amount: -120,
          attachment: null,
          category: 'Professional fees',
          companyId: 'company-id',
          date: '2026-08-20T00:00:00.000Z',
          description: 'Quarterly bookkeeping',
          id: 'pending-id',
          name: 'Oak & Co Accountants',
          refund: false,
          scheduled: true,
          status: 'pending' as const,
          vat: 20,
        },
      ],
      nextToken: null as string | null,
    },
  },
  error: undefined as Error | undefined,
  fetchMore: vi.fn().mockResolvedValue(undefined),
  loading: false,
  networkStatus: undefined,
  refetch: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@apollo/client/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client/react')>()),
  useQuery: () => query,
}));

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useNavigate: () => vi.fn(),
}));

vi.mock('@motech-development/breeze-ui/icons', () => ({
  AddIcon: () => <svg aria-hidden="true" />,
  ArrowLeftIcon: () => <svg aria-hidden="true" />,
  ArrowRightIcon: () => <svg aria-hidden="true" />,
  CalendarIcon: () => <svg aria-hidden="true" />,
  WarningIcon: () => <svg aria-hidden="true" />,
}));

describe('PendingTransactionsPageContent', () => {
  beforeEach(() => {
    query.data = {
      getBalance: { currency: 'GBP', id: 'company-id' },
      getTransactions: {
        items: [
          {
            amount: -120,
            attachment: null,
            category: 'Professional fees',
            companyId: 'company-id',
            date: '2026-08-20T00:00:00.000Z',
            description: 'Quarterly bookkeeping',
            id: 'pending-id',
            name: 'Oak & Co Accountants',
            refund: false,
            scheduled: true,
            status: 'pending',
            vat: 20,
          },
        ],
        nextToken: null,
      },
    };
    query.error = undefined;
    query.loading = false;
    vi.clearAllMocks();
  });

  it('announces the initial Pending Transactions load', () => {
    query.data = undefined as never;
    query.loading = true;

    render(
      <BreezeProvider locale="en-GB">
        <PendingTransactionsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    expect(
      screen.getByRole('status', { name: 'Loading Pending Transactions' }),
    ).toHaveAttribute('aria-busy', 'true');
  });

  it('presents the dedicated Pending Transaction collection', () => {
    render(
      <BreezeProvider locale="en-GB">
        <PendingTransactionsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Pending Transactions' }),
    ).toBeVisible();
    expect(
      screen.getByRole('link', { name: 'Back to Transactions' }),
    ).toHaveAttribute('href', '/my-companies/accounts/company-id');
    expect(
      screen.getByRole('link', { name: 'Record transaction' }),
    ).toHaveAttribute(
      'href',
      '/my-companies/accounts/company-id/pending-transactions/record-transaction',
    );
    expect(
      screen.getByRole('img', { name: 'Scheduled transaction' }),
    ).toBeVisible();
  });

  it('keeps cached Pending Transactions visible after a refresh failure', () => {
    query.error = new Error('Refresh failed');

    render(
      <BreezeProvider locale="en-GB">
        <PendingTransactionsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    expect(
      screen.getByText(
        'Transactions could not be refreshed. Existing results are still shown.',
      ),
    ).toBeVisible();
    expect(screen.getByText('Quarterly bookkeeping')).toBeVisible();
    expect(
      screen.queryByText('We could not load Pending Transactions'),
    ).not.toBeInTheDocument();
  });

  it('offers recovery when Pending Transactions have no initial data', async () => {
    query.data = undefined as never;
    query.error = new Error('Initial load failed');

    render(
      <BreezeProvider locale="en-GB">
        <PendingTransactionsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    expect(
      screen.getByText('We could not load Pending Transactions'),
    ).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(query.refetch).toHaveBeenCalledOnce();
  });

  it('retries a failed refresh while retaining the current ledger', async () => {
    query.error = new Error('Refresh failed');
    query.refetch.mockRejectedValueOnce(new Error('Still unavailable'));

    render(
      <BreezeProvider locale="en-GB">
        <PendingTransactionsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(query.refetch).toHaveBeenCalledOnce();
    expect(screen.getByText('Quarterly bookkeeping')).toBeVisible();
  });

  it('loads the next Pending Transaction page', async () => {
    query.data.getTransactions.nextToken = 'page-2';
    query.fetchMore.mockRejectedValueOnce(new Error('Page unavailable'));

    render(
      <BreezeProvider locale="en-GB">
        <PendingTransactionsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Load more' }));

    expect(query.fetchMore).toHaveBeenCalledWith({
      variables: { nextToken: 'page-2' },
    });
  });
});
