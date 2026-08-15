import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen } from '@testing-library/react';
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
        categories: [{ name: 'Professional fees', vatRate: 20 }],
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
  useMutation: (document: {
    definitions?: { name?: { value?: string } }[];
  }) => {
    const operation = document.definitions?.find(({ name }) => name)?.name
      ?.value;

    return operation === 'RequestUpload'
      ? [mocks.requestUpload, { loading: false }]
      : [vi.fn(), { loading: false }];
  },
  useQuery: () => mocks.query,
}));

vi.mock('@motech-development/breeze-ui', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@motech-development/breeze-ui')>()),
  useToast: () => mocks.toast,
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
    mocks.query.data = successfulQueryData;
    mocks.query.error = undefined;
    mocks.query.loading = false;
    mocks.query.refetch.mockClear();
    mocks.requestUpload.mockReset();
    mocks.uploadPresignedFile.mockReset();
  });

  it('exposes the complete accounting form with purchase defaults', () => {
    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="transactions" />
      </BreezeProvider>,
    );

    expect(screen.getByLabelText('Purchase')).toBeChecked();
    expect(screen.getByLabelText('Sale')).not.toBeChecked();
    expect(screen.getByLabelText('Confirmed')).not.toBeChecked();
    expect(screen.getByLabelText('Pending')).not.toBeChecked();
    expect(screen.getByLabelText('No')).toBeChecked();
    expect(screen.getByRole('combobox', { name: 'Supplier' })).toBeVisible();
    expect(screen.getByRole('combobox', { name: 'Description' })).toBeVisible();
    expect(screen.getByLabelText('Category')).toBeVisible();
    expect(screen.getByLabelText('Amount')).toBeVisible();
    expect(screen.getByLabelText('VAT')).toBeVisible();
    expect(screen.getByText('Choose one PDF, JPG, or PNG file.')).toBeVisible();
  });

  it('defaults a Pending Transaction entry to Pending and offers scheduling', () => {
    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="pending" />
      </BreezeProvider>,
    );

    expect(screen.getByLabelText('Pending')).toBeChecked();
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

    await userEvent.upload(
      document.querySelector('input[type="file"]') as HTMLInputElement,
      new File(['invoice'], 'invoice.pdf', { type: 'application/pdf' }),
    );

    const fieldset = document.querySelector('form fieldset');

    expect(fieldset).toBeInstanceOf(HTMLFieldSetElement);
    expect(fieldset).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  });
});
