import { BreezeProvider } from '@motech-development/breeze-ui';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RecordTransactionPage } from './RecordTransactionPage';

const mocks = vi.hoisted(() => ({
  addTransaction: vi.fn(),
  navigate: vi.fn(),
  queryResult: {
    data: undefined as
      | {
          getClients: {
            id: string;
            items: Array<{ id: string; name: string }>;
          };
          getSettings: {
            id: string;
            vat: { pay: number };
          };
        }
      | undefined,
    error: undefined as Error | undefined,
    loading: false,
    refetch: vi.fn(),
  },
  requestUpload: vi.fn(),
  toast: { show: vi.fn() },
  uploadPresignedFile: vi.fn(),
}));

vi.mock('@apollo/client/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client/react')>()),
  useMutation: (
    document: Readonly<{
      definitions?: ReadonlyArray<{
        kind?: string;
        name?: Readonly<{ value?: string }>;
      }>;
    }>,
  ) => {
    const operationName = document.definitions?.find(
      (definition) => definition.kind === 'OperationDefinition',
    )?.name?.value;

    return operationName === 'RequestUpload'
      ? [mocks.requestUpload, { loading: false }]
      : [mocks.addTransaction];
  },
  useQuery: () => mocks.queryResult,
}));

const successfulQueryData = {
  getClients: {
    id: 'company-id',
    items: [{ id: 'client-id', name: 'Example client' }],
  },
  getSettings: {
    id: 'company-id',
    vat: { pay: 20 },
  },
};

vi.mock('@motech-development/breeze-ui', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@motech-development/breeze-ui')>()),
  useToast: () => mocks.toast,
}));

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useBlocker: () => ({
    proceed: vi.fn(),
    reset: vi.fn(),
    status: 'idle',
  }),
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

describe('RecordTransactionPage', () => {
  beforeEach(() => {
    mocks.addTransaction.mockReset();
    mocks.navigate.mockReset();
    mocks.navigate.mockResolvedValue(undefined);
    mocks.queryResult.data = successfulQueryData;
    mocks.queryResult.error = undefined;
    mocks.queryResult.loading = false;
    mocks.queryResult.refetch.mockReset();
    mocks.requestUpload.mockReset();
    mocks.toast.show.mockReset();
    mocks.uploadPresignedFile.mockReset();
  });

  it('retries loading the sale form after its query fails', async () => {
    const user = userEvent.setup();

    mocks.queryResult.data = undefined;
    mocks.queryResult.error = new Error('Query failed');
    mocks.queryResult.refetch.mockResolvedValue(undefined);

    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="transactions" />
      </BreezeProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(mocks.queryResult.refetch).toHaveBeenCalledOnce();
  });

  it('explains why a sale cannot be recorded without an existing client', () => {
    mocks.queryResult.data = {
      ...successfulQueryData,
      getClients: { id: 'company-id', items: [] },
    };

    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="transactions" />
      </BreezeProvider>,
    );

    expect(
      screen.getByRole('heading', { name: 'No clients available' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Add a client before recording a confirmed sale.'),
    ).toBeInTheDocument();
    expect(screen.queryByText('Transaction details')).not.toBeInTheDocument();
  });

  it('offers only the confirmed sale choices with a known-client selector', async () => {
    const user = userEvent.setup();

    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="transactions" />
      </BreezeProvider>,
    );

    expect(screen.getByLabelText('Sale')).toBeChecked();
    expect(screen.getByLabelText('Confirmed')).toBeChecked();
    expect(screen.queryByLabelText('Purchase')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Pending')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Refund')).not.toBeInTheDocument();

    const supplier = screen.getByRole('button', { name: /Supplier/ });

    await user.click(supplier);
    await user.click(screen.getByRole('option', { name: 'Example client' }));

    expect(supplier).toHaveTextContent('Example client');
  });

  it("defaults the Transaction Date to today's date for the user", () => {
    const originalTimeZone = process.env.TZ;

    process.env.TZ = 'Europe/London';
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-06T23:30:00.000Z'));

    try {
      render(
        <BreezeProvider locale="en-GB" timeZone="Europe/London">
          <RecordTransactionPage companyId="company-id" origin="transactions" />
        </BreezeProvider>,
      );

      expect(
        screen.getByRole('button', { name: /Calendar Date/ }),
      ).toHaveTextContent('7 August 2026');
    } finally {
      vi.useRealTimers();

      if (originalTimeZone === undefined) {
        delete process.env.TZ;
      } else {
        process.env.TZ = originalTimeZone;
      }
    }
  });

  it('calculates VAT while the amount field remains focused', async () => {
    const user = userEvent.setup();

    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="transactions" />
      </BreezeProvider>,
    );

    const amount = screen.getByLabelText('Amount');

    await user.type(amount, '100');

    expect(amount).toHaveFocus();
    expect(screen.getByLabelText('VAT')).toHaveValue('£20.00');
  });

  it('enables saving when an amount is filled in', async () => {
    const user = userEvent.setup();

    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="transactions" />
      </BreezeProvider>,
    );

    await user.click(screen.getByRole('button', { name: /Supplier/ }));
    await user.click(screen.getByRole('option', { name: 'Example client' }));
    await user.type(screen.getByLabelText('Description'), 'Consulting');
    fireEvent.input(screen.getByLabelText('Amount'), {
      target: { value: '100' },
    });

    await waitFor(() => {
      expect(screen.getByLabelText('Amount')).toHaveValue('£100.00');
      expect(screen.getByLabelText('VAT')).toHaveValue('£20.00');
      expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
    });
  });

  it('shows amount and VAT validation when each field is blurred', async () => {
    const user = userEvent.setup();

    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="transactions" />
      </BreezeProvider>,
    );

    const amount = screen.getByLabelText('Amount');
    const vat = screen.getByLabelText('VAT');

    expect(
      screen.queryByText('Enter an amount greater than zero'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Enter VAT of zero or more'),
    ).not.toBeInTheDocument();

    await user.click(amount);
    await user.tab();

    expect(amount).toHaveAccessibleDescription(
      'Enter an amount greater than zero',
    );

    await user.click(vat);
    await user.tab();

    expect(vat).toHaveAccessibleDescription('Enter VAT of zero or more');
  });

  it('validates silently on load and clears a visible error while editing', async () => {
    const user = userEvent.setup();

    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="transactions" />
      </BreezeProvider>,
    );

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    expect(screen.queryByText('Enter a description')).not.toBeInTheDocument();
    const description = screen.getByLabelText('Description');

    await user.click(description);
    await user.tab();

    expect(description).toHaveAccessibleDescription('Enter a description');

    await user.type(description, 'Consulting');

    expect(description).not.toHaveAccessibleDescription('Enter a description');
  });

  it('submits a valid sale only once when Save is activated repeatedly', async () => {
    const user = userEvent.setup();
    let resolveMutation: (() => void) | undefined;

    mocks.addTransaction.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveMutation = () =>
            resolve({
              data: {
                addTransaction: {
                  description: 'Consulting',
                  name: 'Example client',
                },
              },
            });
        }),
    );

    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="transactions" />
      </BreezeProvider>,
    );

    await user.click(screen.getByRole('button', { name: /Supplier/ }));
    await user.click(screen.getByRole('option', { name: 'Example client' }));
    await user.type(screen.getByLabelText('Description'), 'Consulting');
    await user.type(screen.getByLabelText('Amount'), '100');
    const save = screen.getByRole('button', { name: 'Save' });

    await user.dblClick(save);

    expect(mocks.addTransaction).toHaveBeenCalledTimes(1);
    expect(save).toBeDisabled();

    resolveMutation?.();
  });

  it('prevents the drawer closing while a sale submission is pending', async () => {
    const user = userEvent.setup();
    let resolveMutation: (() => void) | undefined;

    mocks.addTransaction.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveMutation = () =>
            resolve({
              data: {
                addTransaction: {
                  description: 'Consulting',
                  name: 'Example client',
                },
              },
            });
        }),
    );

    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="transactions" />
      </BreezeProvider>,
    );

    await user.click(screen.getByRole('button', { name: /Supplier/ }));
    await user.click(screen.getByRole('option', { name: 'Example client' }));
    await user.type(screen.getByLabelText('Description'), 'Consulting');
    await user.type(screen.getByLabelText('Amount'), '100');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(
      screen.getByRole('heading', { name: 'Record transaction' }),
    ).toBeVisible();
    expect(mocks.navigate).not.toHaveBeenCalled();

    resolveMutation?.();
  });

  it('waits for the selected PDF upload before recording the sale', async () => {
    const user = userEvent.setup();
    let completeUpload: (() => void) | undefined;
    const file = new File(['invoice'], 'invoice.pdf', {
      type: 'application/pdf',
    });

    mocks.requestUpload.mockResolvedValue({
      data: {
        requestUpload: {
          id: 'upload-id',
          url: 'https://upload/invoice',
        },
      },
    });
    mocks.uploadPresignedFile.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          completeUpload = resolve;
        }),
    );
    mocks.addTransaction.mockResolvedValue({
      data: {
        addTransaction: {
          description: 'Consulting',
          name: 'Example client',
        },
      },
    });

    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="transactions" />
      </BreezeProvider>,
    );

    await user.click(screen.getByRole('button', { name: /Supplier/ }));
    await user.click(screen.getByRole('option', { name: 'Example client' }));
    await user.type(screen.getByLabelText('Description'), 'Consulting');
    await user.type(screen.getByLabelText('Amount'), '100');
    const input = document.querySelector('input[type="file"]');

    expect(input).toBeInstanceOf(HTMLInputElement);
    await user.upload(input as HTMLInputElement, file);
    await waitFor(() => {
      expect(mocks.uploadPresignedFile).toHaveBeenCalledOnce();
    });
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(mocks.addTransaction).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(
      screen.getByRole('heading', { name: 'Record transaction' }),
    ).toBeVisible();
    expect(mocks.navigate).not.toHaveBeenCalled();

    act(() => {
      completeUpload?.();
    });

    await waitFor(() => {
      expect(mocks.addTransaction).toHaveBeenCalledOnce();
      const mutationOptions: unknown = mocks.addTransaction.mock.calls[0]?.[0];

      expect(mutationOptions).toMatchObject({
        variables: {
          input: {
            attachment: 'company-id/upload-id.pdf',
            id: '',
          },
        },
      });
    });
  });

  it('restores dismissal after an attachment transfer fails', async () => {
    const user = userEvent.setup();
    const file = new File(['invoice'], 'invoice.pdf', {
      type: 'application/pdf',
    });

    mocks.requestUpload.mockResolvedValue({
      data: {
        requestUpload: {
          id: 'upload-id',
          url: 'https://upload/invoice',
        },
      },
    });
    mocks.uploadPresignedFile.mockRejectedValue(new Error('Upload failed'));

    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="transactions" />
      </BreezeProvider>,
    );

    await user.click(screen.getByRole('button', { name: /Supplier/ }));
    await user.click(screen.getByRole('option', { name: 'Example client' }));
    await user.type(screen.getByLabelText('Description'), 'Consulting');
    await user.type(screen.getByLabelText('Amount'), '100');
    const input = document.querySelector('input[type="file"]');

    expect(input).toBeInstanceOf(HTMLInputElement);
    await user.upload(input as HTMLInputElement, file);
    await screen.findByRole('button', { name: 'Retry upload' });
    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled(),
    );
    await user.click(screen.getByRole('button', { name: 'Close' }));
    await user.click(screen.getByRole('button', { name: 'Discard changes' }));

    expect(mocks.addTransaction).not.toHaveBeenCalled();
    expect(mocks.navigate).toHaveBeenCalledWith({
      params: { companyId: 'company-id' },
      to: '/my-companies/accounts/$companyId',
    });
  });

  it('does not report a recorded sale as failed when navigation fails', async () => {
    const user = userEvent.setup();

    mocks.addTransaction.mockResolvedValue({
      data: {
        addTransaction: {
          description: 'Consulting',
          name: 'Example client',
        },
      },
    });
    mocks.navigate.mockRejectedValue(new Error('Navigation failed'));

    render(
      <BreezeProvider locale="en-GB">
        <RecordTransactionPage companyId="company-id" origin="transactions" />
      </BreezeProvider>,
    );

    await user.click(screen.getByRole('button', { name: /Supplier/ }));
    await user.click(screen.getByRole('option', { name: 'Example client' }));
    await user.type(screen.getByLabelText('Description'), 'Consulting');
    await user.type(screen.getByLabelText('Amount'), '100');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(mocks.toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Confirmed sale recorded',
          variant: 'success',
        }),
      );
    });
    expect(mocks.toast.show).not.toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Sale could not be recorded',
        variant: 'danger',
      }),
    );
  });
});
