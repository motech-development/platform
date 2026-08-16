import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createAccountsCache } from '../../data/cache';
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
  status: 'confirmed' as 'confirmed' | 'pending',
  vat: 15,
};

const mocks = vi.hoisted(() => ({
  deleteFile: vi.fn(),
  deleteTransaction: vi.fn(),
  formQuery: {
    data: undefined as Record<string, unknown> | undefined,
    error: undefined as Error | undefined,
    loading: false,
    refetch: vi.fn().mockResolvedValue(undefined),
  },
  navigate: vi.fn().mockResolvedValue(undefined),
  toast: { show: vi.fn() },
  transactionQuery: {
    data: undefined as undefined | { getTransaction: typeof transaction },
    error: undefined as Error | undefined,
    loading: false,
    refetch: vi.fn().mockResolvedValue(undefined),
  },
}));

const formData = {
  getBalance: { currency: 'GBP', id: 'company-id' },
  getClients: {
    id: 'company-id',
    items: [{ id: 'client-id', name: 'Known client' }],
  },
  getSettings: {
    categories: [{ name: 'Professional fees', vatRate: 20 }],
    id: 'company-id',
    vat: { pay: 20 },
  },
  getTypeahead: {
    id: 'company-id',
    purchases: ['Bookkeeping'],
    sales: ['Retainer'],
    suppliers: ['Oak & Co'],
  },
};

vi.mock('@apollo/client/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client/react')>()),
  useMutation: (document: {
    definitions?: { name?: { value?: string } }[];
  }) => {
    const operation = document.definitions?.find(({ name }) => name)?.name
      ?.value;

    if (operation === 'DeleteTransaction') {
      return [mocks.deleteTransaction, { loading: false }];
    }
    if (operation === 'DeleteFile') {
      return [mocks.deleteFile, { loading: false }];
    }
    return [vi.fn(), { loading: false }];
  },
  useQuery: (document: { definitions?: { name?: { value?: string } }[] }) => {
    const operation = document.definitions?.find(({ name }) => name)?.name
      ?.value;

    return operation === 'Transaction'
      ? mocks.transactionQuery
      : mocks.formQuery;
  },
}));

vi.mock('@motech-development/breeze-ui', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@motech-development/breeze-ui')>()),
  useToast: () => mocks.toast,
}));

vi.mock('@motech-development/breeze-ui/icons', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('@motech-development/breeze-ui/icons')
  >()),
  CloseIcon: () => <span aria-hidden="true">close</span>,
  WarningIcon: () => <span aria-hidden="true">warning</span>,
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
    mocks.deleteFile.mockResolvedValue({
      data: { deleteFile: { path: 'company-id/invoice.pdf' } },
    });
    mocks.deleteTransaction.mockImplementation((options: unknown) => {
      const result = { data: { deleteTransaction: transaction } };
      const { update } = options as {
        update?: (
          cache: ReturnType<typeof createAccountsCache>,
          mutation: typeof result,
        ) => void;
      };

      update?.(createAccountsCache(), result);
      return Promise.resolve(result);
    });
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

  it.each([
    ['pending', '/my-companies/accounts/$companyId/pending-transactions'],
    ['transactions', '/my-companies/accounts/$companyId'],
  ] as const)(
    'closes an unavailable %s Transaction to its collection',
    async (origin, to) => {
      mocks.transactionQuery.error = new Error('Unavailable');

      render(
        <BreezeProvider locale="en-GB">
          <TransactionEditPage
            companyId="company-id"
            origin={origin}
            transactionId="transaction-id"
          />
        </BreezeProvider>,
      );

      await userEvent.click(screen.getByRole('button', { name: 'Close' }));

      expect(mocks.navigate).toHaveBeenCalledWith({
        params: { companyId: 'company-id' },
        to,
      });
    },
  );

  it('keeps an unavailable drawer usable when close navigation rejects', async () => {
    mocks.transactionQuery.error = new Error('Unavailable');
    mocks.navigate.mockRejectedValueOnce(new Error('Navigation failed'));

    render(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="transactions"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.getByText('Transaction unavailable')).toBeVisible();
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

  it('keeps a failed edit-form retry recoverable', async () => {
    mocks.transactionQuery.data = { getTransaction: transaction };
    mocks.formQuery.error = new Error('Settings unavailable');
    mocks.formQuery.refetch.mockRejectedValueOnce(
      new Error('Still unavailable'),
    );

    render(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="transactions"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(mocks.formQuery.refetch).toHaveBeenCalledOnce();
    expect(screen.getByText('Transaction form unavailable')).toBeVisible();
  });

  it('announces form preparation after the Transaction has loaded', () => {
    mocks.transactionQuery.data = { getTransaction: transaction };
    mocks.formQuery.loading = true;

    render(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="transactions"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    expect(screen.getByText('Preparing transaction form…')).toHaveAttribute(
      'aria-live',
      'polite',
    );
  });

  it('presents the saved accounting values as an edit form', () => {
    mocks.transactionQuery.data = { getTransaction: transaction };
    mocks.formQuery.data = formData;

    render(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="transactions"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    expect(screen.getByLabelText('Sale')).toBeChecked();
    expect(
      screen.getByRole('radiogroup', { name: 'Transaction type' }),
    ).toHaveAttribute('aria-readonly', 'true');
    expect(screen.getByLabelText('No')).toBeChecked();
    expect(screen.getByLabelText('Amount')).toHaveValue('£75.00');
    expect(screen.getByLabelText('VAT')).toHaveValue('£15.00');
  });

  it('keeps the edit form available when saving returns no Transaction', async () => {
    mocks.transactionQuery.data = { getTransaction: transaction };
    mocks.formQuery.data = formData;

    render(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="transactions"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() =>
      expect(mocks.toast.show).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Transaction could not be saved' }),
      ),
    );
    expect(screen.getByLabelText('Amount')).toHaveValue('£75.00');
  });

  it('closes a clean Pending edit to its Pending collection', async () => {
    mocks.transactionQuery.data = {
      getTransaction: { ...transaction, scheduled: true, status: 'pending' },
    };
    mocks.formQuery.data = formData;

    render(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="pending"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(mocks.navigate).toHaveBeenCalledWith({
      params: { companyId: 'company-id' },
      to: '/my-companies/accounts/$companyId/pending-transactions',
    });
  });

  it('retries both transaction and form prerequisites after a refresh failure', async () => {
    mocks.transactionQuery.data = { getTransaction: transaction };
    mocks.transactionQuery.error = new Error('Transaction refresh failed');
    mocks.transactionQuery.refetch.mockRejectedValueOnce(
      new Error('Still unavailable'),
    );
    mocks.formQuery.data = formData;

    render(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="transactions"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(mocks.formQuery.refetch).toHaveBeenCalledOnce();
    expect(mocks.transactionQuery.refetch).toHaveBeenCalledOnce();
    expect(screen.getByLabelText('Amount')).toHaveValue('£75.00');
  });

  it('deletes the Transaction after exact confirmation', async () => {
    mocks.transactionQuery.data = { getTransaction: transaction };
    mocks.formQuery.data = formData;
    mocks.navigate.mockRejectedValueOnce(new Error('Navigation failed'));

    render(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="transactions"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Delete Transaction' }),
    );
    await userEvent.type(
      screen.getByLabelText('Type Retainer to confirm'),
      'Retainer',
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Permanently delete Transaction' }),
    );

    await waitFor(() => expect(mocks.deleteTransaction).toHaveBeenCalledOnce());
    expect(mocks.navigate).toHaveBeenCalledWith({
      params: { companyId: 'company-id' },
      to: '/my-companies/accounts/$companyId',
    });
    expect(mocks.toast.show).toHaveBeenCalledWith({
      title: 'Transaction deleted',
      variant: 'success',
    });
  });

  it('keeps deletion available for retry when no Transaction is returned', async () => {
    mocks.transactionQuery.data = { getTransaction: transaction };
    mocks.formQuery.data = formData;
    mocks.deleteTransaction.mockResolvedValueOnce({ data: null });

    render(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="transactions"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Delete Transaction' }),
    );
    await userEvent.type(
      screen.getByLabelText('Type Retainer to confirm'),
      'Retainer',
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Permanently delete Transaction' }),
    );

    await waitFor(() =>
      expect(mocks.toast.show).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Transaction could not be deleted' }),
      ),
    );
    expect(screen.getByRole('alertdialog')).toBeVisible();
    expect(mocks.navigate).not.toHaveBeenCalled();
  });
});
