import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TransactionEditPage } from './TransactionEditPage';

const transaction = {
  amount: 75,
  attachment: null,
  category: 'Sales',
  companyId: 'company-id',
  date: '2026-08-16T00:00:00.000Z',
  description: 'Retainer',
  id: 'transaction-id',
  name: 'Known client',
  refund: false,
  scheduled: false,
  status: 'confirmed' as const,
  vat: 15,
};

const mocks = vi.hoisted(() => ({
  formQuery: {
    data: undefined as Record<string, unknown> | undefined,
    error: undefined as Error | undefined,
    loading: false,
    refetch: vi.fn().mockResolvedValue(undefined),
  },
  navigate: vi.fn().mockResolvedValue(undefined),
  transactionQuery: {
    data: undefined as undefined | { getTransaction: typeof transaction },
    error: undefined as Error | undefined,
    loading: false,
    refetch: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('@apollo/client/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client/react')>()),
  useMutation: () => [vi.fn(), { loading: false }],
  useQuery: (document: { definitions?: { name?: { value?: string } }[] }) => {
    const operation = document.definitions?.find(({ name }) => name)?.name
      ?.value;

    return operation === 'Transaction'
      ? mocks.transactionQuery
      : mocks.formQuery;
  },
}));

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useBlocker: () => ({ proceed: vi.fn(), reset: vi.fn(), status: 'idle' }),
  useNavigate: () => mocks.navigate,
}));

vi.mock('../../pwa/connectivity', () => ({ useOnlineStatus: () => true }));

vi.mock('./PendingTransactionsPageContent', () => ({
  PendingTransactionsPageContent: () => <main>Pending Transactions</main>,
}));

vi.mock('./TransactionsPageContent', () => ({
  TransactionsPageContent: () => <main>Transactions</main>,
}));

describe('TransactionEditPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.formQuery.data = undefined;
    mocks.formQuery.error = undefined;
    mocks.formQuery.loading = false;
    mocks.formQuery.refetch.mockResolvedValue(undefined);
    mocks.navigate.mockResolvedValue(undefined);
    mocks.transactionQuery.data = undefined;
    mocks.transactionQuery.error = undefined;
    mocks.transactionQuery.loading = false;
    mocks.transactionQuery.refetch.mockResolvedValue(undefined);
  });

  it('announces the initial Transaction load inside the drawer', () => {
    mocks.transactionQuery.loading = true;

    render(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="transactions"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    expect(screen.getByText('Loading Transaction…')).toBeVisible();
  });

  it('offers retry when the Transaction is unavailable', async () => {
    mocks.transactionQuery.error = new Error('Unavailable');

    render(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="transactions"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    expect(screen.getByText('Transaction unavailable')).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(mocks.transactionQuery.refetch).toHaveBeenCalledOnce();
  });

  it('never leaves a Transaction from another company in a loading state', () => {
    mocks.transactionQuery.data = {
      getTransaction: { ...transaction, companyId: 'another-company-id' },
    };

    render(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="transactions"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    expect(screen.getByText('Transaction unavailable')).toBeVisible();
    expect(screen.queryByText('Loading Transaction…')).not.toBeInTheDocument();
  });

  it('offers retry when the edit-form prerequisites are unavailable', async () => {
    mocks.transactionQuery.data = { getTransaction: transaction };
    mocks.formQuery.error = new Error('Settings unavailable');

    render(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="transactions"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    expect(screen.getByText('Transaction form unavailable')).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(mocks.formQuery.refetch).toHaveBeenCalledOnce();
    expect(mocks.transactionQuery.refetch).toHaveBeenCalledOnce();
  });
});
