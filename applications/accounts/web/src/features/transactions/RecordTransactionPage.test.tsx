import { BreezeProvider } from '@motech-development/breeze-ui';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RecordTransactionPage } from './RecordTransactionPage';

const mocks = vi.hoisted(() => {
  const query: {
    data: Record<string, unknown> | undefined;
    error: Error | undefined;
    loading: boolean;
    refetch: ReturnType<typeof vi.fn>;
  } = {
    data: {
      getBalance: { currency: 'GBP', id: 'company-id' },
      getClients: {
        id: 'company-id',
        items: [{ id: 'client-id', name: 'Example client' }],
      },
      getSettings: {
        categories: [
          { name: 'Travel', vatRate: 20 },
          { name: 'Professional fees', vatRate: 20 },
        ],
        id: 'company-id',
        vat: { pay: 20 },
      },
      getTypeahead: {
        id: 'company-id',
        purchases: ['Bookkeeping'],
        sales: ['Consulting'],
        suppliers: ['Oak & Co'],
      },
    },
    error: undefined,
    loading: false,
    refetch: vi.fn().mockResolvedValue(undefined),
  };

  return {
    deleteFile: vi.fn(),
    downloadQuery: vi.fn(),
    navigate: vi.fn().mockResolvedValue(undefined),
    query,
    requestUpload: vi.fn(),
    toast: { show: vi.fn() },
    uploadPresignedFile: vi.fn(),
  };
});
const successfulQueryData = mocks.query.data;

vi.mock('@apollo/client/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client/react')>()),
  useApolloClient: () => ({ query: mocks.downloadQuery }),
  useMutation: (document: {
    definitions?: { name?: { value?: string } }[];
  }) => {
    const operation = document.definitions?.find(({ name }) => name)?.name
      ?.value;

    if (operation === 'RequestUpload') {
      return [mocks.requestUpload, { loading: false }];
    }
    if (operation === 'DeleteFile') {
      return [mocks.deleteFile, { loading: false }];
    }
    return [vi.fn(), { loading: false }];
  },
  useQuery: () => mocks.query,
}));

vi.mock('@motech-development/breeze-ui', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@motech-development/breeze-ui')>()),
  useToast: () => mocks.toast,
}));

vi.mock('@motech-development/breeze-ui/icons', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('@motech-development/breeze-ui/icons')
  >()),
  WarningIcon: () => <svg aria-hidden="true" />,
}));

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useBlocker: () => ({ proceed: vi.fn(), reset: vi.fn(), status: 'idle' }),
  useNavigate: () => mocks.navigate,
}));

vi.mock('../../pwa/connectivity', () => ({
  useOnlineStatus: () => true,
}));

vi.mock('../../data/presigned-transfer', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../data/presigned-transfer')>()),
  uploadPresignedFile: mocks.uploadPresignedFile,
}));

vi.mock('./DashboardPageContent', () => ({
  DashboardPageContent: () => <main>Dashboard</main>,
}));

vi.mock('./TransactionsPageContent', () => ({
  TransactionsPageContent: () => <main>Transactions</main>,
}));

vi.mock('./PendingTransactionsPageContent', () => ({
  PendingTransactionsPageContent: () => <main>Pending Transactions</main>,
}));

describe('RecordTransactionPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.query.data = successfulQueryData;
    mocks.query.error = undefined;
    mocks.query.loading = false;
    mocks.query.refetch.mockClear();
    mocks.requestUpload.mockReset();
    mocks.deleteFile.mockReset();
    mocks.downloadQuery.mockReset();
    mocks.uploadPresignedFile.mockReset();
    mocks.navigate.mockResolvedValue(undefined);
  });

  it('matches the prototype initial purchase composition', () => {
    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="transactions" />
      </BreezeProvider>,
    );

    expect(screen.getByText('Add money coming in or going out.')).toBeVisible();
    expect(screen.getByLabelText('Purchase')).toBeChecked();
    expect(screen.getByLabelText('Sale')).not.toBeChecked();
    expect(screen.getByLabelText('Confirmed')).not.toBeChecked();
    expect(screen.getByLabelText('Pending')).not.toBeChecked();
    expect(screen.getByLabelText('No')).toBeChecked();
    expect(screen.getByRole('combobox', { name: 'Supplier' })).toBeVisible();
    expect(screen.getByRole('combobox', { name: 'Description' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Calendar Date' })).toBeVisible();
    expect(screen.getByLabelText('Category')).toBeVisible();
    expect(screen.getByLabelText('Amount')).toBeVisible();
    expect(screen.getByLabelText('VAT')).toBeVisible();
    expect(screen.getByRole('radiogroup', { name: 'Refund' })).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Transaction amount' }),
    ).toBeVisible();
    expect(
      screen.getByText('Status determines when the balance is updated.'),
    ).toBeVisible();
    expect(
      screen.getByText('Attach an invoice or receipt to this transaction.'),
    ).toBeVisible();
    expect(
      screen.getByRole('region', { name: 'Invoice or receipt' }),
    ).toBeVisible();
    expect(screen.getByText('PDF, JPG or PNG')).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Save transaction' }),
    ).toBeVisible();
  });

  it('keeps accounting status unset when opened from Pending Transactions', async () => {
    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="pending" />
      </BreezeProvider>,
    );

    expect(screen.getByLabelText('Confirmed')).not.toBeChecked();
    expect(screen.getByLabelText('Pending')).not.toBeChecked();
    expect(
      screen.queryByRole('radiogroup', { name: 'Schedule transaction' }),
    ).not.toBeInTheDocument();

    await userEvent.click(screen.getByLabelText('Pending'));

    expect(
      screen.getByRole('radiogroup', { name: 'Schedule transaction' }),
    ).toBeVisible();
  });

  it('uses the known client selector for sales', async () => {
    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="transactions" />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByLabelText('Sale'));

    expect(
      screen.getByRole('button', { name: 'Select client Client' }),
    ).toBeVisible();
    expect(screen.queryByLabelText('Category')).not.toBeInTheDocument();
  });

  it('commits purchase suggestions and calculates inclusive VAT', async () => {
    const user = userEvent.setup();

    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="transactions" />
      </BreezeProvider>,
    );

    await user.click(screen.getByLabelText('Purchase'));

    const supplier = screen.getByRole('combobox', { name: 'Supplier' });
    const description = screen.getByRole('combobox', { name: 'Description' });
    const amount = screen.getByLabelText('Amount');
    const transactionVat = screen.getByLabelText('VAT');

    expect(amount).toBeDisabled();
    expect(transactionVat).toBeDisabled();

    await user.type(supplier, 'Oak & Co');
    await user.keyboard('{ArrowDown}{Enter}');
    await user.type(description, 'Bookkeeping');
    await user.keyboard('{ArrowDown}{Enter}');
    await user.click(screen.getByRole('button', { name: /Category/u }));
    await user.click(
      await screen.findByRole('option', { name: 'Professional fees' }),
    );
    expect(amount).toBeEnabled();
    expect(transactionVat).toBeEnabled();
    await user.clear(amount);
    await user.type(amount, '120');

    expect(supplier).toHaveValue('Oak & Co');
    expect(description).toHaveValue('Bookkeeping');
    expect(screen.getByLabelText('VAT')).toHaveValue('£20.00');

    await user.clear(supplier);
    await user.type(supplier, 'New supplier{Enter}');
    expect(supplier).toHaveValue('New supplier');
  });

  it('switches accounting meaning and keeps derived fields consistent', async () => {
    const user = userEvent.setup();

    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="pending" />
      </BreezeProvider>,
    );

    await user.click(screen.getByLabelText('Pending'));
    const schedule = screen.getByRole('radiogroup', {
      name: 'Schedule transaction',
    });

    await user.click(within(schedule).getByLabelText('Yes'));
    expect(within(schedule).getByLabelText('Yes')).toBeChecked();
    await user.click(screen.getByLabelText('Confirmed'));
    expect(
      screen.queryByRole('radiogroup', { name: 'Schedule transaction' }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByLabelText('Sale'));
    await user.click(screen.getByRole('button', { name: /Client/u }));
    await user.click(
      await screen.findByRole('option', { name: 'Example client' }),
    );
    await user.clear(screen.getByLabelText('Amount'));
    await user.type(screen.getByLabelText('Amount'), '100');

    expect(screen.getByLabelText('VAT')).toHaveValue('£20.00');
    expect(screen.getByLabelText('No')).toBeChecked();
    expect(screen.queryByLabelText('Category')).not.toBeInTheDocument();
  });

  it('updates dates, refund meaning, and manually entered VAT', async () => {
    const user = userEvent.setup();
    const today = new Date();
    const selectedDate = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 15, 12),
    );

    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="transactions" />
      </BreezeProvider>,
    );

    await user.click(screen.getByLabelText('Purchase'));
    await user.click(screen.getByRole('button', { name: /Category/u }));
    await user.click(
      await screen.findByRole('option', { name: 'Professional fees' }),
    );
    await user.click(screen.getByRole('button', { name: 'Calendar Date' }));
    await user.click(
      screen.getByRole('button', {
        name: new Intl.DateTimeFormat('en-GB', {
          dateStyle: 'full',
          timeZone: 'UTC',
        }).format(selectedDate),
      }),
    );
    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Refund' })).getByLabelText(
        'Yes',
      ),
    );
    await user.clear(screen.getByLabelText('VAT'));
    await user.type(screen.getByLabelText('VAT'), '7.50');
    await user.tab();

    expect(
      within(screen.getByRole('radiogroup', { name: 'Refund' })).getByLabelText(
        'Yes',
      ),
    ).toBeChecked();
    expect(screen.getByLabelText('VAT')).toHaveValue('£7.50');
  });

  it('closes a clean record drawer to its originating collection', async () => {
    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="dashboard" />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(mocks.navigate).toHaveBeenCalledWith({
      params: { companyId: 'company-id' },
      to: '/my-companies/dashboard/$companyId',
    });
  });

  it('closes a clean Pending record drawer to the Pending collection', async () => {
    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="pending" />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(mocks.navigate).toHaveBeenCalledWith({
      params: { companyId: 'company-id' },
      to: '/my-companies/accounts/$companyId/pending-transactions',
    });
  });

  it('clears calculated VAT when an amount has no applicable category rate', async () => {
    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="transactions" />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByLabelText('Purchase'));
    const amountInput = screen.getByLabelText('Amount');

    await act(async () => {
      fireEvent.input(amountInput, {
        data: '100',
        inputType: 'insertFromPaste',
        target: { value: '100' },
      });
      await Promise.resolve();
    });

    expect(screen.getByLabelText('VAT')).toHaveValue('');
  });

  it('sorts purchase categories while preserving their source indexes', async () => {
    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="transactions" />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByLabelText('Purchase'));
    await userEvent.click(screen.getByRole('button', { name: /Category/ }));

    const options = screen.getAllByRole('option');

    expect(options.map((option) => option.textContent)).toEqual([
      'Professional fees',
      'Travel',
    ]);
    expect(options[0]).toHaveAttribute('data-category-index', '1');
    expect(options[1]).toHaveAttribute('data-category-index', '0');
  });

  it('uses the VAT rate from the selected duplicate category', async () => {
    mocks.query.data = {
      ...successfulQueryData,
      getSettings: {
        categories: [
          { name: 'Professional fees', vatRate: 20 },
          { name: 'Professional fees', vatRate: 10 },
        ],
        id: 'company-id',
        vat: { pay: 20 },
      },
    };
    const user = userEvent.setup();

    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="transactions" />
      </BreezeProvider>,
    );

    await user.click(screen.getByLabelText('Purchase'));
    await user.click(screen.getByRole('button', { name: /Category/u }));
    await user.click(
      screen.getAllByRole('option', { name: 'Professional fees' })[1],
    );
    await user.type(screen.getByLabelText('Amount'), '120');

    expect(screen.getByLabelText('VAT')).toHaveValue('£10.91');
  });

  it('retries the form query after it fails', async () => {
    mocks.query.error = new Error('failed');
    mocks.query.data = undefined;

    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="transactions" />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(mocks.query.refetch).toHaveBeenCalledOnce();
  });

  it('keeps the unavailable state visible while a retry is loading', () => {
    mocks.query.data = undefined;
    mocks.query.error = new Error('failed');
    mocks.query.loading = true;

    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="transactions" />
      </BreezeProvider>,
    );

    expect(screen.getByText('Transaction form unavailable')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeDisabled();
    expect(
      screen.queryByRole('status', { name: 'Loading transaction form' }),
    ).not.toBeInTheDocument();
  });

  it('retains the form while a failed background refresh is retried', async () => {
    mocks.query.error = new Error('failed');
    mocks.query.refetch.mockRejectedValueOnce(new Error('still failed'));

    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="transactions" />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByLabelText('Purchase'));
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(mocks.query.refetch).toHaveBeenCalledOnce();
    expect(screen.getByRole('combobox', { name: 'Supplier' })).toBeVisible();
  });

  it('renders a dismissible form skeleton while the form has no initial data', async () => {
    mocks.query.data = undefined;
    mocks.query.loading = true;

    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="transactions" />
      </BreezeProvider>,
    );

    expect(
      screen.getByRole('status', { name: 'Loading transaction form' }),
    ).toBeVisible();
    expect(
      screen.getByRole('dialog', { name: 'Record transaction' }),
    ).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() =>
      expect(mocks.navigate).toHaveBeenCalledWith({
        params: { companyId: 'company-id' },
        to: '/my-companies/accounts/$companyId',
      }),
    );
  });

  it('keeps an invalid browser form submission open', () => {
    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="transactions" />
      </BreezeProvider>,
    );

    fireEvent.submit(document.querySelector('form') as HTMLFormElement);

    expect(
      screen.getByRole('dialog', { name: 'Record transaction' }),
    ).toBeVisible();
    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  it('disables the complete form while an attachment transfer is pending', async () => {
    mocks.requestUpload.mockResolvedValue({
      data: { requestUpload: { id: 'upload-id', url: 'https://upload' } },
    });
    mocks.uploadPresignedFile.mockReturnValue(
      new Promise(() => {
        // The unresolved transfer keeps the form in its pending state.
      }),
    );

    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="transactions" />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByLabelText('Purchase'));
    await userEvent.upload(
      document.querySelector('input[type="file"]') as HTMLInputElement,
      new File(['invoice'], 'invoice.pdf', { type: 'application/pdf' }),
    );

    const fieldset = document.querySelector('form fieldset');

    expect(fieldset).toBeInstanceOf(HTMLFieldSetElement);
    expect(fieldset).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  });

  it('keeps an uploaded attachment visible when its cleanup fails', async () => {
    mocks.requestUpload.mockResolvedValue({
      data: { requestUpload: { id: 'upload-id', url: 'https://upload' } },
    });
    mocks.uploadPresignedFile.mockResolvedValue(undefined);
    mocks.deleteFile.mockResolvedValue({ data: null });

    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="transactions" />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByLabelText('Purchase'));
    await userEvent.upload(
      document.querySelector('input[type="file"]') as HTMLInputElement,
      new File(['invoice'], 'invoice.pdf', { type: 'application/pdf' }),
    );
    expect(await screen.findByText('upload-id.pdf')).toBeVisible();

    await userEvent.click(screen.getByRole('button', { name: 'Delete file' }));

    await waitFor(() =>
      expect(mocks.toast.show).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Attachment cleanup failed' }),
      ),
    );
    expect(screen.getByText('upload-id.pdf')).toBeVisible();
  });

  it('returns to the upload control after removing an uploaded attachment', async () => {
    mocks.requestUpload.mockResolvedValue({
      data: { requestUpload: { id: 'upload-id', url: 'https://upload' } },
    });
    mocks.uploadPresignedFile.mockResolvedValue(undefined);
    mocks.deleteFile.mockResolvedValue({
      data: { deleteFile: { path: 'company-id/upload-id.pdf' } },
    });

    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="transactions" />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByLabelText('Purchase'));
    await userEvent.upload(
      document.querySelector('input[type="file"]') as HTMLInputElement,
      new File(['invoice'], 'invoice.pdf', { type: 'application/pdf' }),
    );
    await userEvent.click(
      await screen.findByRole('button', { name: 'Delete file' }),
    );

    expect(await screen.findByText('No file selected')).toBeVisible();
  });
});
