import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { BreezeProvider } from '@motech-development/breeze-ui';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createAccountsCache } from '../../data/cache';
import { TransactionEditPage } from './TransactionEditPage';

const transaction = {
  amount: 75,
  attachment: null as string | null,
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
  downloadQuery: vi.fn(),
  formQuery: {
    data: undefined as Record<string, unknown> | undefined,
    error: undefined as Error | undefined,
    loading: false,
    refetch: vi.fn().mockResolvedValue(undefined),
  },
  navigate: vi.fn().mockResolvedValue(undefined),
  requestUpload: vi.fn(),
  toast: { show: vi.fn() },
  transactionCache: undefined as unknown as ReturnType<
    typeof createAccountsCache
  >,
  transactionQuery: {
    data: undefined as undefined | { getTransaction: typeof transaction },
    error: undefined as Error | undefined,
    loading: false,
    refetch: vi.fn().mockResolvedValue(undefined),
  },
  updateTransaction: vi.fn(),
  uploadPresignedFile: vi.fn(),
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
  useApolloClient: () => ({
    cache: mocks.transactionCache,
    query: mocks.downloadQuery,
  }),
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
    if (operation === 'RequestUpload') {
      return [mocks.requestUpload, { loading: false }];
    }
    if (operation === 'UpdateTransaction') {
      return [mocks.updateTransaction, { loading: false }];
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

vi.mock('../../data/presigned-transfer', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../data/presigned-transfer')>()),
  uploadPresignedFile: mocks.uploadPresignedFile,
}));

vi.mock('./PendingTransactionsPageContent', () => ({
  PendingTransactionsPageContent: () => <main>Pending Transactions</main>,
}));

vi.mock('./DashboardPageContent', () => ({
  DashboardPageContent: () => <main>Dashboard</main>,
}));

vi.mock('./TransactionsPageContent', () => ({
  TransactionsPageContent: () => <main>Transactions</main>,
}));

describe('TransactionEditPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.transactionCache = createAccountsCache();
    mocks.formQuery.data = undefined;
    mocks.formQuery.error = undefined;
    mocks.formQuery.loading = false;
    mocks.formQuery.refetch.mockResolvedValue(undefined);
    mocks.downloadQuery.mockReset();
    mocks.deleteFile.mockReset();
    mocks.deleteFile.mockResolvedValue({
      data: { deleteFile: { path: 'company-id/invoice.pdf' } },
    });
    mocks.deleteTransaction.mockReset();
    mocks.deleteTransaction.mockImplementation((options: unknown) => {
      const result = { data: { deleteTransaction: transaction } };
      const { update } = options as {
        update?: (
          cache: ReturnType<typeof createAccountsCache>,
          mutation: typeof result,
        ) => void;
      };

      update?.(mocks.transactionCache, result);
      return Promise.resolve(result);
    });
    mocks.navigate.mockResolvedValue(undefined);
    mocks.requestUpload.mockReset();
    mocks.transactionQuery.data = undefined;
    mocks.transactionQuery.error = undefined;
    mocks.transactionQuery.loading = false;
    mocks.transactionQuery.refetch.mockResolvedValue(undefined);
    mocks.updateTransaction.mockReset();
    mocks.updateTransaction.mockResolvedValue({ data: null });
    mocks.uploadPresignedFile.mockReset();
  });

  it('shows the Transaction form skeleton inside the drawer while loading', () => {
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

    expect(
      screen.getByRole('dialog', { name: 'Edit transaction' }),
    ).toBeVisible();
    expect(
      screen.getByRole('status', { name: 'Loading transaction form' }),
    ).toBeVisible();
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
    ['dashboard', '/my-companies/dashboard/$companyId'],
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

  it('renders a dismissible form skeleton after the Transaction has loaded', async () => {
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

    expect(
      screen.getByRole('status', { name: 'Loading transaction form' }),
    ).toBeVisible();
    expect(
      screen.getByRole('dialog', { name: 'Edit transaction' }),
    ).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() =>
      expect(mocks.navigate).toHaveBeenCalledWith({
        params: { companyId: 'company-id' },
        to: '/my-companies/accounts/$companyId',
      }),
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

    expect(
      screen.getByText('Update the transaction and its attachment.'),
    ).toBeVisible();
    expect(
      screen.getByText('Transaction type cannot be changed after creation.'),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Transaction amount' }),
    ).toBeVisible();
    expect(
      screen.getByText('Status determines when the balance is updated.'),
    ).toBeVisible();
    expect(screen.getByLabelText('Sale')).toBeChecked();
    expect(
      screen.getByRole('radiogroup', { name: 'Transaction type' }),
    ).toHaveAttribute('aria-readonly', 'true');
    expect(screen.getByLabelText('No')).toBeChecked();
    expect(screen.getByLabelText('Amount')).toHaveValue('£75.00');
    expect(screen.getByLabelText('VAT')).toHaveValue('£15.00');
    expect(
      screen.getByRole('button', { name: 'Save transaction' }),
    ).toBeVisible();
  });

  it('refreshes a pristine edit form from the authoritative Transaction', async () => {
    mocks.transactionQuery.data = { getTransaction: transaction };
    mocks.formQuery.data = formData;

    const view = render(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="transactions"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    mocks.transactionQuery.data = {
      getTransaction: { ...transaction, amount: 90 },
    };
    view.rerender(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="transactions"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    await waitFor(() =>
      expect(screen.getByLabelText('Amount')).toHaveValue('£90.00'),
    );
  });

  it('requires a dirty edit form to reload a concurrent Transaction update', async () => {
    mocks.transactionQuery.data = { getTransaction: transaction };
    mocks.formQuery.data = formData;

    const view = render(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="transactions"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    const amount = screen.getByLabelText('Amount');

    await userEvent.clear(amount);
    await userEvent.type(amount, '80');

    mocks.transactionQuery.data = {
      getTransaction: { ...transaction, amount: 90 },
    };
    view.rerender(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="transactions"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    expect(
      await screen.findByText(
        'This transaction changed elsewhere. Reload the latest details before continuing.',
      ),
    ).toBeVisible();
    expect(amount).toHaveValue('80');
    expect(
      screen.getByRole('button', { name: 'Save transaction' }),
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Delete transaction' }),
    ).toBeDisabled();

    await userEvent.click(
      screen.getByRole('button', { name: 'Reload latest' }),
    );

    await waitFor(() => expect(amount).toHaveValue('£90.00'));
    expect(
      screen.queryByText(
        'This transaction changed elsewhere. Reload the latest details before continuing.',
      ),
    ).not.toBeInTheDocument();
  });

  it('restores the authoritative attachment name when reloading a staged replacement', async () => {
    const authoritativeAttachment = 'company-id/old-invoice.pdf';

    mocks.transactionQuery.data = {
      getTransaction: { ...transaction, attachment: authoritativeAttachment },
    };
    mocks.formQuery.data = formData;
    mocks.requestUpload.mockResolvedValue({
      data: { requestUpload: { id: 'replacement-id', url: 'https://upload' } },
    });
    mocks.uploadPresignedFile.mockResolvedValue(undefined);
    mocks.deleteFile.mockResolvedValue({
      data: { deleteFile: { path: 'company-id/replacement-id.pdf' } },
    });
    const view = render(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="transactions"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Replace file' }));
    await userEvent.upload(
      document.querySelector('input[type="file"]') as HTMLInputElement,
      new File(['replacement'], 'replacement.pdf', {
        type: 'application/pdf',
      }),
    );
    expect(await screen.findByText('replacement.pdf')).toBeVisible();

    mocks.transactionQuery.data = {
      getTransaction: {
        ...transaction,
        amount: 90,
        attachment: authoritativeAttachment,
      },
    };
    view.rerender(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="transactions"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    await userEvent.click(
      await screen.findByRole('button', { name: 'Reload latest' }),
    );

    await waitFor(() =>
      expect(screen.getByText('old-invoice.pdf')).toBeVisible(),
    );
    expect(screen.queryByText('replacement.pdf')).not.toBeInTheDocument();
    expect(mocks.deleteFile).toHaveBeenCalledWith({
      variables: {
        id: 'company-id',
        path: 'company-id/replacement-id.pdf',
      },
    });
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

    await userEvent.click(
      screen.getByRole('button', { name: 'Save transaction' }),
    );

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

  it('preserves the dashboard behind an Overview edit', async () => {
    mocks.transactionQuery.data = {
      getTransaction: { ...transaction, status: 'pending' },
    };
    mocks.formQuery.data = formData;

    render(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="dashboard"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    expect(screen.getByText('Dashboard')).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(mocks.navigate).toHaveBeenCalledWith({
      params: { companyId: 'company-id' },
      to: '/my-companies/dashboard/$companyId',
    });
  });

  it('closes a Pending edit when the Transaction is published', async () => {
    mocks.transactionQuery.data = {
      getTransaction: { ...transaction, scheduled: true, status: 'pending' },
    };
    mocks.formQuery.data = formData;

    const view = render(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="pending"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    expect(
      screen.getByRole('heading', { name: 'Edit transaction' }),
    ).toBeVisible();

    mocks.transactionQuery.data = { getTransaction: transaction };
    view.rerender(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="pending"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    await waitFor(() =>
      expect(mocks.navigate).toHaveBeenCalledWith({
        params: { companyId: 'company-id' },
        to: '/my-companies/accounts/$companyId/pending-transactions',
      }),
    );
  });

  it('closes a mixed-ledger Pending edit when the Transaction is published', async () => {
    mocks.transactionQuery.data = {
      getTransaction: { ...transaction, scheduled: true, status: 'pending' },
    };
    mocks.formQuery.data = formData;

    const view = render(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="transactions"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    expect(
      screen.getByRole('heading', { name: 'Edit transaction' }),
    ).toBeVisible();

    mocks.transactionQuery.data = { getTransaction: transaction };
    view.rerender(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="transactions"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    await waitFor(() =>
      expect(mocks.navigate).toHaveBeenCalledWith({
        params: { companyId: 'company-id' },
        to: '/my-companies/accounts/$companyId',
      }),
    );
  });

  it('keeps a confirmed edit open when its status is changed to Pending', async () => {
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

    const pendingStatus = screen.getByRole('radio', { name: 'Pending' });

    await userEvent.click(pendingStatus);
    expect(pendingStatus).toBeChecked();
    await act(() => Promise.resolve());
    expect(mocks.navigate).not.toHaveBeenCalled();
    expect(
      screen.getByRole('heading', { name: 'Edit transaction' }),
    ).toBeVisible();
  });

  it('discards a staged attachment before leaving a published Pending edit', async () => {
    mocks.transactionQuery.data = {
      getTransaction: { ...transaction, scheduled: true, status: 'pending' },
    };
    mocks.formQuery.data = formData;
    mocks.requestUpload.mockResolvedValue({
      data: { requestUpload: { id: 'upload-id', url: 'https://upload' } },
    });
    mocks.uploadPresignedFile.mockResolvedValue(undefined);

    const view = render(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="pending"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    await userEvent.upload(
      document.querySelector('input[type="file"]') as HTMLInputElement,
      new File(['invoice'], 'invoice.pdf', { type: 'application/pdf' }),
    );
    expect(await screen.findByText('invoice.pdf')).toBeVisible();

    mocks.transactionQuery.data = { getTransaction: transaction };
    view.rerender(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="pending"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledOnce());
    expect(mocks.deleteFile).toHaveBeenCalledWith({
      variables: {
        id: 'company-id',
        path: 'company-id/upload-id.pdf',
      },
    });
    expect(mocks.navigate).toHaveBeenCalledWith({
      params: { companyId: 'company-id' },
      to: '/my-companies/accounts/$companyId/pending-transactions',
    });
    expect(mocks.deleteFile.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.navigate.mock.invocationCallOrder[0],
    );
  });

  it('keeps a published Pending edit open when staged attachment cleanup fails', async () => {
    mocks.transactionQuery.data = {
      getTransaction: { ...transaction, scheduled: true, status: 'pending' },
    };
    mocks.formQuery.data = formData;
    mocks.requestUpload.mockResolvedValue({
      data: { requestUpload: { id: 'upload-id', url: 'https://upload' } },
    });
    mocks.uploadPresignedFile.mockResolvedValue(undefined);
    mocks.deleteFile.mockResolvedValue({ data: null });

    const view = render(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="pending"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    await userEvent.upload(
      document.querySelector('input[type="file"]') as HTMLInputElement,
      new File(['invoice'], 'invoice.pdf', { type: 'application/pdf' }),
    );

    mocks.transactionQuery.data = { getTransaction: transaction };
    view.rerender(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="pending"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    await waitFor(() =>
      expect(mocks.toast.show).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Attachment cleanup failed' }),
      ),
    );
    expect(mocks.navigate).not.toHaveBeenCalled();
    expect(
      screen.getByRole('heading', { name: 'Edit transaction' }),
    ).toBeVisible();
    await act(() => {
      view.rerender(
        <BreezeProvider locale="en-GB">
          <TransactionEditPage
            companyId="company-id"
            origin="pending"
            transactionId="transaction-id"
          />
        </BreezeProvider>,
      );
      return Promise.resolve();
    });
    expect(mocks.deleteFile).toHaveBeenCalledOnce();

    mocks.deleteFile.mockResolvedValue({
      data: { deleteFile: { path: 'company-id/upload-id.pdf' } },
    });
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await userEvent.click(
      screen.getByRole('button', { name: 'Discard changes' }),
    );

    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledOnce());
    expect(mocks.deleteFile).toHaveBeenCalledTimes(2);
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

  it('keeps a persisted sale client visible after it leaves the client list', () => {
    mocks.transactionQuery.data = { getTransaction: transaction };
    mocks.formQuery.data = {
      ...formData,
      getClients: { ...formData.getClients, items: [] },
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

    expect(
      screen.getByRole('button', { name: 'Known client Client' }),
    ).toBeVisible();
  });

  it('keeps a persisted purchase category visible after it leaves Settings', () => {
    mocks.transactionQuery.data = {
      getTransaction: {
        ...transaction,
        amount: -75,
        category: 'Archived expenses',
        name: 'Known supplier',
      },
    };
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

    expect(
      screen.getByRole('button', { name: 'Archived expenses Category' }),
    ).toBeVisible();
  });

  it('deletes the Transaction after exact confirmation', async () => {
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

    await userEvent.click(
      screen.getByRole('button', { name: 'Delete transaction' }),
    );
    await userEvent.type(
      screen.getByLabelText('Type Known client to confirm'),
      'Known client',
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Permanently delete transaction' }),
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

  it('retains persisted attachment cleanup for retry after deleting its Transaction', async () => {
    mocks.transactionQuery.data = {
      getTransaction: {
        ...transaction,
        attachment: 'company-id/old-invoice.pdf',
      },
    };
    mocks.formQuery.data = formData;
    mocks.deleteFile
      .mockResolvedValueOnce({ data: null })
      .mockResolvedValueOnce({
        data: { deleteFile: { path: 'company-id/old-invoice.pdf' } },
      });

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
      screen.getByRole('button', { name: 'Delete transaction' }),
    );
    await userEvent.type(
      screen.getByLabelText('Type Known client to confirm'),
      'Known client',
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Permanently delete transaction' }),
    );

    await waitFor(() =>
      expect(mocks.toast.show).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Attachment cleanup failed' }),
      ),
    );
    expect(
      screen.getByRole('button', { name: 'Close delete confirmation' }),
    ).toBeDisabled();
    expect(mocks.navigate).not.toHaveBeenCalled();
    expect(mocks.deleteTransaction).toHaveBeenCalledOnce();
    expect(mocks.deleteFile).toHaveBeenCalledWith({
      variables: {
        id: 'company-id',
        path: 'company-id/old-invoice.pdf',
      },
    });
    expect(mocks.deleteTransaction.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.deleteFile.mock.invocationCallOrder[0],
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Permanently delete transaction' }),
    );

    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledOnce());
    expect(mocks.deleteTransaction).toHaveBeenCalledOnce();
    expect(mocks.deleteFile).toHaveBeenCalledTimes(2);
  });

  it('retries navigation after the Transaction has been deleted', async () => {
    mocks.transactionQuery.data = { getTransaction: transaction };
    mocks.formQuery.data = formData;
    mocks.navigate.mockRejectedValueOnce(new Error('Navigation failed'));
    const evictTransaction = vi.spyOn(mocks.transactionCache, 'evict');

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
      screen.getByRole('button', { name: 'Delete transaction' }),
    );
    await userEvent.type(
      screen.getByLabelText('Type Known client to confirm'),
      'Known client',
    );
    const confirmDeletion = screen.getByRole('button', {
      name: 'Permanently delete transaction',
    });

    await userEvent.click(confirmDeletion);

    await waitFor(() =>
      expect(mocks.toast.show).toHaveBeenCalledWith({
        description:
          'The transaction was deleted. Try opening the transaction list again.',
        title: 'Transaction list could not be opened',
        variant: 'danger',
      }),
    );
    expect(mocks.deleteTransaction).toHaveBeenCalledOnce();
    expect(evictTransaction).toHaveBeenCalledOnce();
    expect(screen.getByRole('alertdialog')).toBeVisible();
    expect(mocks.toast.show).not.toHaveBeenCalledWith({
      title: 'Transaction deleted',
      variant: 'success',
    });

    await userEvent.click(confirmDeletion);

    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledTimes(2));
    expect(mocks.deleteTransaction).toHaveBeenCalledOnce();
    expect(evictTransaction).toHaveBeenCalledOnce();
    expect(mocks.toast.show).toHaveBeenCalledWith({
      title: 'Transaction deleted',
      variant: 'success',
    });
  });

  it('offers to replace an attachment without removing the current file', async () => {
    let finishDeletion!: (result: {
      data: { deleteFile: { path: string } };
    }) => void;
    const deletion = new Promise<{
      data: { deleteFile: { path: string } };
    }>((resolve) => {
      finishDeletion = resolve;
    });

    mocks.transactionQuery.data = {
      getTransaction: {
        ...transaction,
        attachment: 'company-id/old-invoice.pdf',
      },
    };
    mocks.formQuery.data = formData;
    mocks.requestUpload.mockResolvedValue({
      data: { requestUpload: { id: 'replacement-id', url: 'https://upload' } },
    });
    mocks.uploadPresignedFile.mockResolvedValue(undefined);

    render(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="transactions"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    expect(screen.getByText('old-invoice.pdf')).toBeVisible();
    expect(screen.queryByText('No file selected')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Replace file' }));

    expect(screen.getByText('old-invoice.pdf')).toBeVisible();
    expect(screen.getByText('No file selected')).toBeVisible();

    await userEvent.upload(
      document.querySelector('input[type="file"]') as HTMLInputElement,
      new File(['replacement'], 'replacement.pdf', {
        type: 'application/pdf',
      }),
    );
    expect(await screen.findByText('replacement.pdf')).toBeVisible();
    expect(mocks.deleteFile).not.toHaveBeenCalled();

    mocks.deleteFile.mockReturnValueOnce(deletion);
    await userEvent.click(screen.getByRole('button', { name: 'Replace file' }));

    await waitFor(() => expect(mocks.deleteFile).toHaveBeenCalledOnce());
    expect(screen.queryByText('No file selected')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Replace file' })).toBeDisabled();
    await act(async () => {
      finishDeletion({
        data: {
          deleteFile: { path: 'company-id/replacement-id.pdf' },
        },
      });
      await deletion;
    });
    expect(mocks.deleteFile).toHaveBeenCalledWith({
      variables: {
        id: 'company-id',
        path: 'company-id/replacement-id.pdf',
      },
    });
    expect(await screen.findByText('No file selected')).toBeVisible();
  });

  it('retries obsolete attachment cleanup before deleting the Transaction', async () => {
    const transactionWithAttachment = {
      ...transaction,
      attachment: 'company-id/old-invoice.pdf',
    };

    mocks.transactionQuery.data = {
      getTransaction: transactionWithAttachment,
    };
    mocks.formQuery.data = formData;
    mocks.updateTransaction.mockResolvedValue({
      data: {
        updateTransaction: {
          ...transactionWithAttachment,
          attachment: null,
        },
      },
    });
    mocks.deleteFile
      .mockResolvedValueOnce({ data: null })
      .mockResolvedValueOnce({
        data: { deleteFile: { path: 'company-id/old-invoice.pdf' } },
      });

    render(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="transactions"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Delete file' }));
    await userEvent.click(
      screen.getByRole('button', { name: 'Save transaction' }),
    );

    await waitFor(() => expect(mocks.deleteFile).toHaveBeenCalledOnce());
    expect(mocks.updateTransaction).toHaveBeenCalledOnce();
    expect(mocks.deleteTransaction).not.toHaveBeenCalled();
    expect(mocks.navigate).not.toHaveBeenCalled();

    await userEvent.click(
      screen.getByRole('button', { name: 'Delete transaction' }),
    );
    await userEvent.type(
      screen.getByLabelText('Type Known client to confirm'),
      'Known client',
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Permanently delete transaction' }),
    );

    await waitFor(() => expect(mocks.deleteTransaction).toHaveBeenCalledOnce());
    expect(mocks.deleteFile).toHaveBeenCalledTimes(2);
    expect(mocks.deleteFile.mock.invocationCallOrder[1]).toBeLessThan(
      mocks.deleteTransaction.mock.invocationCallOrder[0],
    );
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
      screen.getByRole('button', { name: 'Delete transaction' }),
    );
    await userEvent.type(
      screen.getByLabelText('Type Known client to confirm'),
      'Known client',
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Permanently delete transaction' }),
    );

    await waitFor(() =>
      expect(mocks.toast.show).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Transaction could not be deleted' }),
      ),
    );
    expect(screen.getByRole('alertdialog')).toBeVisible();
    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  it('finishes attachment cleanup when a retry proves the Transaction was already deleted', async () => {
    const transactionWithAttachment = {
      ...transaction,
      attachment: 'company-id/invoice.pdf',
    };
    const alreadyDeleted = new CombinedGraphQLErrors({
      errors: [
        {
          extensions: {
            errorType: 'DynamoDB:ConditionalCheckFailedException',
          },
          message: 'The conditional request failed',
        },
      ],
    });

    mocks.transactionQuery.data = {
      getTransaction: transactionWithAttachment,
    };
    mocks.formQuery.data = formData;
    mocks.deleteTransaction
      .mockRejectedValueOnce(new Error('Response lost'))
      .mockRejectedValueOnce(alreadyDeleted);

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
      screen.getByRole('button', { name: 'Delete transaction' }),
    );
    await userEvent.type(
      screen.getByLabelText('Type Known client to confirm'),
      'Known client',
    );
    const confirmDeletion = screen.getByRole('button', {
      name: 'Permanently delete transaction',
    });

    await userEvent.click(confirmDeletion);
    await waitFor(() =>
      expect(mocks.toast.show).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Transaction could not be deleted' }),
      ),
    );
    expect(mocks.deleteFile).not.toHaveBeenCalled();

    await userEvent.click(confirmDeletion);

    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledOnce());
    expect(mocks.deleteTransaction).toHaveBeenCalledTimes(2);
    expect(mocks.deleteFile).toHaveBeenCalledWith({
      variables: {
        id: 'company-id',
        path: 'company-id/invoice.pdf',
      },
    });
    expect(mocks.toast.show).toHaveBeenCalledWith({
      title: 'Transaction deleted',
      variant: 'success',
    });
  });

  it('retains a staged replacement when Transaction deletion fails', async () => {
    mocks.transactionQuery.data = { getTransaction: transaction };
    mocks.formQuery.data = formData;
    mocks.requestUpload.mockResolvedValue({
      data: { requestUpload: { id: 'upload-id', url: 'https://upload' } },
    });
    mocks.uploadPresignedFile.mockResolvedValue(undefined);
    mocks.deleteTransaction.mockRejectedValueOnce(new Error('Unavailable'));

    render(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="transactions"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    await userEvent.upload(
      document.querySelector('input[type="file"]') as HTMLInputElement,
      new File(['invoice'], 'invoice.pdf', { type: 'application/pdf' }),
    );
    expect(await screen.findByText('invoice.pdf')).toBeVisible();

    await userEvent.click(
      screen.getByRole('button', { name: 'Delete transaction' }),
    );
    await userEvent.type(
      screen.getByLabelText('Type Known client to confirm'),
      'Known client',
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Permanently delete transaction' }),
    );

    await waitFor(() =>
      expect(mocks.toast.show).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Transaction could not be deleted' }),
      ),
    );
    expect(mocks.deleteFile).not.toHaveBeenCalled();
    expect(screen.getByText('invoice.pdf')).toBeVisible();
  });

  it('retries staged replacement cleanup without deleting the Transaction twice', async () => {
    mocks.transactionQuery.data = { getTransaction: transaction };
    mocks.formQuery.data = formData;
    mocks.requestUpload.mockResolvedValue({
      data: { requestUpload: { id: 'upload-id', url: 'https://upload' } },
    });
    mocks.uploadPresignedFile.mockResolvedValue(undefined);
    mocks.deleteFile
      .mockResolvedValueOnce({ data: null })
      .mockResolvedValueOnce({
        data: { deleteFile: { path: 'company-id/upload-id.pdf' } },
      });
    const evictTransaction = vi.spyOn(mocks.transactionCache, 'evict');

    render(
      <BreezeProvider locale="en-GB">
        <TransactionEditPage
          companyId="company-id"
          origin="transactions"
          transactionId="transaction-id"
        />
      </BreezeProvider>,
    );

    await userEvent.upload(
      document.querySelector('input[type="file"]') as HTMLInputElement,
      new File(['invoice'], 'invoice.pdf', { type: 'application/pdf' }),
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Delete transaction' }),
    );
    await userEvent.type(
      screen.getByLabelText('Type Known client to confirm'),
      'Known client',
    );
    const confirmDeletion = screen.getByRole('button', {
      name: 'Permanently delete transaction',
    });

    await userEvent.click(confirmDeletion);

    await waitFor(() => expect(mocks.deleteFile).toHaveBeenCalledOnce());
    expect(mocks.deleteTransaction).toHaveBeenCalledOnce();
    expect(evictTransaction).toHaveBeenCalledOnce();
    expect(mocks.navigate).not.toHaveBeenCalled();
    expect(mocks.toast.show).not.toHaveBeenCalledWith({
      title: 'Transaction deleted',
      variant: 'success',
    });
    expect(screen.getByRole('alertdialog')).toBeVisible();

    await userEvent.click(confirmDeletion);

    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledOnce());
    expect(mocks.deleteTransaction).toHaveBeenCalledOnce();
    expect(mocks.deleteFile).toHaveBeenCalledTimes(2);
    expect(evictTransaction).toHaveBeenCalledOnce();
    expect(mocks.toast.show).toHaveBeenCalledWith({
      title: 'Transaction deleted',
      variant: 'success',
    });
  });
});
