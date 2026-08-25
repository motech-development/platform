import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { DashboardQuery } from '../../graphql/graphql';
import { DashboardPageContent } from './DashboardPageContent';

const queryState = vi.hoisted(() => ({
  current: {
    data: undefined as DashboardQuery | undefined,
    error: undefined as Error | undefined,
    loading: true,
    refetch: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('@apollo/client/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client/react')>()),
  useQuery: () => queryState.current,
}));

vi.mock('@auth0/auth0-react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@auth0/auth0-react')>()),
  useAuth0: () => ({
    user: {
      given_name: 'Morgan',
      sub: 'auth0|owner',
    },
  }),
}));

vi.mock('@motech-development/breeze-ui/icons', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('@motech-development/breeze-ui/icons')
  >()),
  AddIcon: () => <svg aria-hidden="true" />,
  ArrowRightIcon: () => <svg aria-hidden="true" />,
  CalendarIcon: () => <svg aria-hidden="true" />,
  CheckIcon: () => <svg aria-hidden="true" />,
  InfoIcon: () => <svg aria-hidden="true" />,
  WarningIcon: () => <svg aria-hidden="true" />,
}));

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useNavigate: () => vi.fn(),
}));

vi.mock('../../auth/owner', () => ({
  useAccountsOwnerId: () => 'auth0|owner',
}));

vi.mock('./CompanyTransactionSubscription', () => ({
  CompanyTransactionSubscription: ({
    children,
  }: Readonly<{ children: ReactNode }>) => children,
}));

const transaction = {
  amount: 2500,
  attachment: 'invoice.pdf',
  category: 'Sales',
  date: '2024-12-24T00:00:00.000Z',
  description: 'Some work',
  id: 'transaction-id',
  name: 'Example client',
} satisfies DashboardQuery['getTransactions']['items'][number];

function dashboardData(
  items: DashboardQuery['getTransactions']['items'],
  pendingItems: DashboardQuery['pendingTransactions']['items'] = [],
): DashboardQuery {
  return {
    getBalance: {
      balance: 2500,
      currency: 'GBP',
      id: 'company-id',
      vat: { owed: 500, paid: 250 },
    },
    getCompany: {
      companyNumber: '12345678',
      id: 'company-id',
      name: 'Example Company',
    },
    getTransactions: {
      id: 'company-id',
      items,
      nextToken: null,
      status: 'confirmed',
    },
    pendingTransactions: {
      id: 'company-id',
      items: pendingItems,
      nextToken: null,
      status: 'pending',
    },
  };
}

describe('DashboardPageContent', () => {
  beforeEach(() => {
    queryState.current.data = undefined;
    queryState.current.error = undefined;
    queryState.current.loading = true;
    queryState.current.refetch.mockClear();
  });

  it('does not display a temporary greeting while the company is loading', () => {
    render(
      <BreezeProvider locale="en-GB">
        <DashboardPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/^$/u);
    expect(screen.queryByText(/Good afternoon/u)).not.toBeInTheDocument();
  });

  it('does not display financial summaries without any activity', () => {
    queryState.current.data = dashboardData([]);
    queryState.current.loading = false;

    render(
      <BreezeProvider locale="en-GB">
        <DashboardPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    expect(
      screen.getByRole('heading', { name: 'No financial activity yet' }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Current balance')).not.toBeInTheDocument();
    expect(screen.queryByText('VAT summary')).not.toBeInTheDocument();
  });

  it('links the attention panel to Pending transactions that need review', () => {
    queryState.current.data = dashboardData(
      [transaction],
      [
        {
          ...transaction,
          attachment: null,
          id: 'pending-transaction-id',
          scheduled: true,
          status: 'pending',
        },
      ],
    );
    queryState.current.loading = false;

    render(
      <BreezeProvider locale="en-GB">
        <DashboardPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    expect(
      screen.getByText('Pending transactions are waiting for review'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /View pending transactions/u }),
    ).toHaveAttribute(
      'href',
      '/my-companies/accounts/company-id/pending-transactions',
    );
    expect(
      screen.queryByText(/recent transaction has no invoice or receipt/u),
    ).not.toBeInTheDocument();
  });

  it('shows a completed review state when there are no Pending transactions', () => {
    queryState.current.data = dashboardData([
      { ...transaction, attachment: null },
    ]);
    queryState.current.loading = false;

    render(
      <BreezeProvider locale="en-GB">
        <DashboardPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    expect(
      screen.getByText('No pending transactions are waiting for review'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('All recorded transactions have been reviewed'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/recent transaction has no invoice or receipt/u),
    ).not.toBeInTheDocument();
  });

  it('includes Pending transactions in recent activity', () => {
    queryState.current.data = dashboardData(
      [],
      [
        {
          ...transaction,
          id: 'pending-transaction-id',
          scheduled: true,
          status: 'pending',
        },
      ],
    );
    queryState.current.loading = false;

    render(
      <BreezeProvider locale="en-GB">
        <DashboardPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    expect(
      screen.queryByRole('heading', { name: 'No financial activity yet' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('row', { name: /Pending transaction: Example client/u }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Latest confirmed and pending activity'),
    ).toBeInTheDocument();
  });

  it('offers to retry when the overview cannot be loaded', async () => {
    const user = userEvent.setup();
    queryState.current.error = new Error('Network unavailable');
    queryState.current.loading = false;

    render(
      <BreezeProvider locale="en-GB">
        <DashboardPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    expect(
      screen.getByRole('heading', {
        name: 'We could not load your overview',
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'No financial activity yet' }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(queryState.current.refetch).toHaveBeenCalledOnce();
  });

  it('retains cached Pending activity with compact refresh recovery', async () => {
    const user = userEvent.setup();

    queryState.current.data = dashboardData(
      [],
      [
        {
          ...transaction,
          id: 'pending-transaction-id',
          scheduled: false,
          status: 'pending',
        },
      ],
    );
    queryState.current.error = new Error('Refresh failed');
    queryState.current.loading = false;

    render(
      <BreezeProvider locale="en-GB">
        <DashboardPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    expect(
      screen.getByText(
        'Overview could not be refreshed. Existing results are still shown.',
      ),
    ).toBeVisible();
    expect(
      screen.getByRole('row', { name: /Pending transaction: Example client/u }),
    ).toBeVisible();
    expect(
      screen.queryByRole('heading', {
        name: 'We could not load your overview',
      }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(queryState.current.refetch).toHaveBeenCalledOnce();
  });
});
