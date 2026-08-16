import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createAccountsCache } from '../../data/cache';
import { useTransactionForm } from './useTransactionForm';

const mocks = vi.hoisted(() => ({
  add: vi.fn(),
  deleteFile: vi.fn(),
  navigate: vi.fn().mockResolvedValue(undefined),
  shouldBlockFn: undefined as undefined | (() => boolean),
  toast: { show: vi.fn() },
  update: vi.fn(),
}));

vi.mock('@apollo/client/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client/react')>()),
  useMutation: (document: {
    definitions?: { name?: { value?: string } }[];
  }) => {
    const operation = document.definitions?.find(({ name }) => name)?.name
      ?.value;

    if (operation === 'UpdateTransaction') {
      return [mocks.update, { loading: false }];
    }
    if (operation === 'DeleteFile') {
      return [mocks.deleteFile, { loading: false }];
    }
    return [mocks.add, { loading: false }];
  },
  useQuery: () => ({
    data: {
      getBalance: { currency: 'GBP', id: 'company-id' },
      getClients: { id: 'company-id', items: [] },
      getSettings: {
        categories: [{ name: 'Professional fees', vatRate: 20 }],
        id: 'company-id',
        vat: { pay: 20 },
      },
      getTypeahead: {
        id: 'company-id',
        purchases: [],
        sales: [],
        suppliers: [],
      },
    },
    error: undefined,
    loading: false,
    refetch: vi.fn(),
  }),
}));

vi.mock('@motech-development/breeze-ui', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@motech-development/breeze-ui')>()),
  useToast: () => mocks.toast,
}));

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useBlocker: ({ shouldBlockFn }: { shouldBlockFn: () => boolean }) => {
    mocks.shouldBlockFn = shouldBlockFn;
    return { proceed: vi.fn(), reset: vi.fn(), status: 'idle' };
  },
  useNavigate: () => mocks.navigate,
}));

vi.mock('../../pwa/connectivity', () => ({ useOnlineStatus: () => true }));

function Harness() {
  const { form } = useTransactionForm({
    companyId: 'company-id',
    confirmedReturnTo: '/my-companies/accounts/$companyId',
    initialDateTime: '2026-08-15T23:13:14.567Z',
  });

  return (
    <>
      <button
        onClick={() => {
          form.setFieldValue('amount', '120');
          form.setFieldValue('category', 'Professional fees');
          form.setFieldValue('description', 'Quarterly bookkeeping');
          form.setFieldValue('name', 'Oak & Co');
          form.setFieldValue('refund', true);
          form.setFieldValue('scheduled', true);
          form.setFieldValue('status', 'pending');
          form.setFieldValue('vat', '20');
          form.handleSubmit().catch(() => undefined);
        }}
        type="button"
      >
        Submit valid refund
      </button>
      <form.Subscribe selector={(state) => state.values.description}>
        {(description) => <output>{description}</output>}
      </form.Subscribe>
    </>
  );
}

function EditHarness() {
  const { form } = useTransactionForm({
    companyId: 'company-id',
    confirmedReturnTo: '/my-companies/accounts/$companyId',
    initialDateTime: '2026-08-16T14:35:12.345Z',
    initialValues: {
      amount: '75',
      attachment: '',
      category: '',
      companyId: 'company-id',
      date: '2026-08-16',
      description: 'Retainer',
      id: 'transaction-id',
      name: 'Known client',
      refund: false,
      scheduled: true,
      status: 'pending',
      transactionType: 'sale',
      vat: '15',
    },
  });

  return (
    <button
      onClick={() => {
        form.setFieldValue('status', 'confirmed');
        form.handleSubmit().catch(() => undefined);
      }}
      type="button"
    >
      Confirm transaction
    </button>
  );
}

function RemoveAttachmentHarness() {
  const { form } = useTransactionForm({
    companyId: 'company-id',
    confirmedReturnTo: '/my-companies/accounts/$companyId',
    initialValues: {
      amount: '75',
      attachment: 'company-id/invoice.pdf',
      category: 'Sales',
      companyId: 'company-id',
      date: '2026-08-16',
      description: 'Retainer',
      id: 'transaction-id',
      name: 'Known client',
      refund: false,
      scheduled: false,
      status: 'confirmed',
      transactionType: 'sale',
      vat: '15',
    },
  });

  return (
    <button
      onClick={() => {
        form.setFieldValue('attachment', '');
        form.handleSubmit().catch(() => undefined);
      }}
      type="button"
    >
      Remove attachment
    </button>
  );
}

function FailedTransferHarness() {
  const { form, trackAttachmentTransfer } = useTransactionForm({
    companyId: 'company-id',
    confirmedReturnTo: '/my-companies/accounts/$companyId',
  });

  return (
    <button
      onClick={() => {
        form.setFieldValue('amount', '120');
        form.setFieldValue('category', 'Professional fees');
        form.setFieldValue('description', 'Quarterly bookkeeping');
        form.setFieldValue('name', 'Oak & Co');
        form.setFieldValue('status', 'confirmed');
        form.setFieldValue('vat', '20');
        trackAttachmentTransfer(Promise.resolve({ status: 'failed' }));
        form.handleSubmit().catch(() => undefined);
      }}
      type="button"
    >
      Submit after failed transfer
    </button>
  );
}

function TransferSubmissionHarness({
  transfer,
}: Readonly<{
  transfer: Promise<
    { path: string; status: 'uploaded' } | { status: 'cancelled' }
  >;
}>) {
  const { form, trackAttachmentTransfer } = useTransactionForm({
    companyId: 'company-id',
    confirmedReturnTo: '/my-companies/accounts/$companyId',
  });

  return (
    <button
      onClick={() => {
        form.setFieldValue('amount', '120');
        form.setFieldValue('category', 'Professional fees');
        form.setFieldValue('description', 'Quarterly bookkeeping');
        form.setFieldValue('name', 'Oak & Co');
        form.setFieldValue('status', 'confirmed');
        form.setFieldValue('vat', '20');
        trackAttachmentTransfer(transfer);
        form.handleSubmit().catch(() => undefined);
      }}
      type="button"
    >
      Submit with attachment transfer
    </button>
  );
}

function PendingTransferHarness() {
  const { trackAttachmentTransfer } = useTransactionForm({
    companyId: 'company-id',
    confirmedReturnTo: '/my-companies/accounts/$companyId',
  });

  return (
    <button
      onClick={() => {
        trackAttachmentTransfer(
          new Promise<never>(() => {
            // Keep the transfer pending to exercise the navigation blocker.
          }),
        );
      }}
      type="button"
    >
      Start attachment transfer
    </button>
  );
}

function StagedAttachmentHarness() {
  const [removed, setRemoved] = useState(false);
  const { removeAttachment, trackAttachmentTransfer } = useTransactionForm({
    companyId: 'company-id',
    confirmedReturnTo: '/my-companies/accounts/$companyId',
  });
  const path = 'company-id/staged-invoice.pdf';

  return (
    <>
      <button
        onClick={() => {
          trackAttachmentTransfer(
            Promise.resolve({ path, status: 'uploaded' }),
          );
        }}
        type="button"
      >
        Stage attachment
      </button>
      <button
        onClick={() => {
          removeAttachment(path)
            .then(setRemoved)
            .catch(() => undefined);
        }}
        type="button"
      >
        Remove staged attachment
      </button>
      {removed ? <p>Staged attachment removed</p> : null}
    </>
  );
}

function DiscardStagedAttachmentHarness() {
  const { discardChanges, markDirty, trackAttachmentTransfer } =
    useTransactionForm({
      companyId: 'company-id',
      confirmedReturnTo: '/my-companies/accounts/$companyId',
    });
  const path = 'company-id/staged-invoice.pdf';

  return (
    <>
      <button
        onClick={() => {
          markDirty();
          trackAttachmentTransfer(
            Promise.resolve({ path, status: 'uploaded' }),
          );
        }}
        type="button"
      >
        Stage attachment
      </button>
      <button
        onClick={() => {
          discardChanges();
        }}
        type="button"
      >
        Discard changes
      </button>
    </>
  );
}

function RemovePersistedAttachmentHarness() {
  const [removed, setRemoved] = useState(false);
  const { removeAttachment } = useTransactionForm({
    companyId: 'company-id',
    confirmedReturnTo: '/my-companies/accounts/$companyId',
  });

  return (
    <>
      <button
        onClick={() => {
          removeAttachment('company-id/persisted-invoice.pdf')
            .then(setRemoved)
            .catch(() => undefined);
        }}
        type="button"
      >
        Remove persisted attachment
      </button>
      {removed ? <p>Persisted attachment retained for save</p> : null}
    </>
  );
}

function PendingCloseHarness() {
  const { requestClose } = useTransactionForm({
    companyId: 'company-id',
    confirmedReturnTo: '/my-companies/accounts/$companyId',
    initialStatus: 'pending',
  });

  return (
    <button onClick={requestClose} type="button">
      Close Pending Transaction
    </button>
  );
}

function RejectedTransferHarness() {
  const { submissionPending, trackAttachmentTransfer } = useTransactionForm({
    companyId: 'company-id',
    confirmedReturnTo: '/my-companies/accounts/$companyId',
  });

  return (
    <>
      <button
        onClick={() => {
          trackAttachmentTransfer(Promise.reject(new Error('Upload failed')));
        }}
        type="button"
      >
        Start rejected transfer
      </button>
      <output>
        {submissionPending ? 'Transfer pending' : 'Transfer settled'}
      </output>
    </>
  );
}

function RejectingDiscardHarness() {
  const { discardChanges, markDirty, trackAttachmentTransfer } =
    useTransactionForm({
      companyId: 'company-id',
      confirmedReturnTo: '/my-companies/accounts/$companyId',
    });

  return (
    <>
      <button
        onClick={() => {
          markDirty();
          trackAttachmentTransfer(Promise.reject(new Error('Upload failed')));
        }}
        type="button"
      >
        Start failed staged transfer
      </button>
      <button onClick={discardChanges} type="button">
        Discard failed transfer
      </button>
    </>
  );
}

function CloseWithStagedAttachmentHarness() {
  const { requestClose, trackAttachmentTransfer } = useTransactionForm({
    companyId: 'company-id',
    confirmedReturnTo: '/my-companies/accounts/$companyId',
  });

  return (
    <>
      <button
        onClick={() => {
          trackAttachmentTransfer(
            Promise.resolve({
              path: 'company-id/staged-invoice.pdf',
              status: 'uploaded',
            }),
          );
        }}
        type="button"
      >
        Stage before close
      </button>
      <button onClick={requestClose} type="button">
        Close with staged attachment
      </button>
    </>
  );
}

function SupersededTransferHarness({
  firstTransfer,
}: Readonly<{
  firstTransfer: Promise<{ path: string; status: 'uploaded' }>;
}>) {
  const [removed, setRemoved] = useState(false);
  const { removeAttachment, trackAttachmentTransfer } = useTransactionForm({
    companyId: 'company-id',
    confirmedReturnTo: '/my-companies/accounts/$companyId',
  });

  return (
    <>
      <button
        onClick={() => {
          trackAttachmentTransfer(firstTransfer);
        }}
        type="button"
      >
        Start first transfer
      </button>
      <button
        onClick={() => {
          trackAttachmentTransfer(Promise.resolve({ status: 'cancelled' }));
        }}
        type="button"
      >
        Supersede transfer
      </button>
      <button
        onClick={() => {
          removeAttachment('company-id/first.pdf')
            .then(setRemoved)
            .catch(() => undefined);
        }}
        type="button"
      >
        Remove superseded attachment
      </button>
      {removed ? <p>Superseded attachment ignored</p> : null}
    </>
  );
}

function runMutationUpdate(options: unknown, result: unknown) {
  const { update } = options as {
    update?: (
      cache: ReturnType<typeof createAccountsCache>,
      mutation: unknown,
    ) => void;
  };

  update?.(createAccountsCache(), result);
}

function mutationInput(mock: typeof mocks.add) {
  const calls = mock.mock.calls as unknown as Array<
    [{ variables: { input: Record<string, unknown> } }]
  >;

  return calls[0]?.[0].variables.input;
}

describe('useTransactionForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.shouldBlockFn = undefined;
    mocks.navigate.mockResolvedValue(undefined);
    const addResult = {
      data: {
        addTransaction: {
          amount: 120,
          attachment: '',
          category: 'Professional fees',
          companyId: 'company-id',
          date: '2026-08-15T00:00:00.000Z',
          description: 'Quarterly bookkeeping',
          id: 'transaction-id',
          name: 'Oak & Co',
          refund: true,
          scheduled: true,
          status: 'pending',
          vat: -20,
        },
      },
    };
    const updateResult = {
      data: {
        updateTransaction: {
          amount: 75,
          attachment: '',
          category: 'Sales',
          companyId: 'company-id',
          date: '2026-08-16T00:00:00.000Z',
          description: 'Retainer',
          id: 'transaction-id',
          name: 'Known client',
          refund: false,
          scheduled: false,
          status: 'confirmed',
          vat: 15,
        },
      },
    };

    mocks.add.mockImplementation((options) => {
      runMutationUpdate(options, addResult);
      return Promise.resolve(addResult);
    });
    mocks.update.mockImplementation((options) => {
      runMutationUpdate(options, updateResult);
      return Promise.resolve(updateResult);
    });
    mocks.deleteFile.mockResolvedValue({
      data: { deleteFile: { path: 'company-id/invoice.pdf' } },
    });
  });

  it('submits the accounting mapping once and returns to the resulting collection', async () => {
    render(
      <BreezeProvider locale="en-GB">
        <Harness />
      </BreezeProvider>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Submit valid refund' }),
    );

    await waitFor(() => expect(mocks.add).toHaveBeenCalledOnce());
    expect(mutationInput(mocks.add)).toMatchObject({
      amount: 120,
      category: 'Professional fees',
      refund: true,
      scheduled: true,
      status: 'pending',
      vat: -20,
    });
    expect(mutationInput(mocks.add).date).toBe('2026-08-15T23:13:14.567Z');
    expect(mocks.navigate).toHaveBeenCalledWith({
      params: { companyId: 'company-id' },
      to: '/my-companies/accounts/$companyId/pending-transactions',
    });
  });

  it('preserves entered values and stays put after a mutation failure', async () => {
    mocks.add.mockRejectedValue(new Error('offline'));

    render(
      <BreezeProvider locale="en-GB">
        <Harness />
      </BreezeProvider>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Submit valid refund' }),
    );

    await waitFor(() =>
      expect(mocks.toast.show).toHaveBeenCalledWith(
        expect.objectContaining({ variant: 'danger' }),
      ),
    );
    expect(screen.getByText('Quarterly bookkeeping')).toBeVisible();
    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  it('updates an existing transaction and returns it to the confirmed collection', async () => {
    render(
      <BreezeProvider locale="en-GB">
        <EditHarness />
      </BreezeProvider>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Confirm transaction' }),
    );

    await waitFor(() => expect(mocks.update).toHaveBeenCalledOnce());
    expect(mocks.add).not.toHaveBeenCalled();
    expect(mutationInput(mocks.update)).toMatchObject({
      category: 'Sales',
      date: '2026-08-16T14:35:12.345Z',
      id: 'transaction-id',
      scheduled: false,
      status: 'confirmed',
    });
    expect(mocks.navigate).toHaveBeenCalledWith({
      params: { companyId: 'company-id' },
      to: '/my-companies/accounts/$companyId',
    });
  });

  it('deletes a replaced attachment only after the Transaction update succeeds', async () => {
    render(
      <BreezeProvider locale="en-GB">
        <RemoveAttachmentHarness />
      </BreezeProvider>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Remove attachment' }),
    );

    await waitFor(() => expect(mocks.deleteFile).toHaveBeenCalledOnce());
    expect(mocks.update).toHaveBeenCalledOnce();
    expect(mocks.update.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.deleteFile.mock.invocationCallOrder[0] ?? 0,
    );
    expect(mocks.deleteFile).toHaveBeenCalledWith({
      variables: {
        id: 'company-id',
        path: 'company-id/invoice.pdf',
      },
    });
  });

  it('retains a persisted attachment when the Transaction update fails', async () => {
    mocks.update.mockRejectedValueOnce(new Error('Update failed'));

    render(
      <BreezeProvider locale="en-GB">
        <RemoveAttachmentHarness />
      </BreezeProvider>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Remove attachment' }),
    );

    await waitFor(() => expect(mocks.update).toHaveBeenCalledOnce());
    expect(mocks.deleteFile).not.toHaveBeenCalled();
  });

  it('deletes a staged attachment when it is removed before submission', async () => {
    mocks.deleteFile.mockResolvedValueOnce({
      data: { deleteFile: { path: 'company-id/staged-invoice.pdf' } },
    });

    render(
      <BreezeProvider locale="en-GB">
        <StagedAttachmentHarness />
      </BreezeProvider>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Stage attachment' }),
    );
    await waitFor(() => expect(mocks.shouldBlockFn?.()).toBe(false));
    await userEvent.click(
      screen.getByRole('button', { name: 'Remove staged attachment' }),
    );

    expect(await screen.findByText('Staged attachment removed')).toBeVisible();
    expect(mocks.deleteFile).toHaveBeenCalledWith({
      variables: {
        id: 'company-id',
        path: 'company-id/staged-invoice.pdf',
      },
    });
    expect(mocks.add).not.toHaveBeenCalled();
    expect(mocks.update).not.toHaveBeenCalled();
  });

  it('deletes a staged attachment before abandoning the form', async () => {
    mocks.deleteFile.mockResolvedValueOnce({
      data: { deleteFile: { path: 'company-id/staged-invoice.pdf' } },
    });

    render(
      <BreezeProvider locale="en-GB">
        <DiscardStagedAttachmentHarness />
      </BreezeProvider>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Stage attachment' }),
    );
    await waitFor(() => expect(mocks.shouldBlockFn?.()).toBe(true));
    await userEvent.click(
      screen.getByRole('button', { name: 'Discard changes' }),
    );

    await waitFor(() => expect(mocks.deleteFile).toHaveBeenCalledOnce());
    expect(mocks.deleteFile.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.navigate.mock.invocationCallOrder[0] ?? 0,
    );
    expect(mocks.navigate).toHaveBeenCalledWith({
      params: { companyId: 'company-id' },
      to: '/my-companies/accounts/$companyId',
    });
  });

  it('explains why a failed attachment transfer blocks submission', async () => {
    render(
      <BreezeProvider locale="en-GB">
        <FailedTransferHarness />
      </BreezeProvider>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Submit after failed transfer' }),
    );

    await waitFor(() =>
      expect(mocks.toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'Retry the attachment, then save again.',
          variant: 'danger',
        }),
      ),
    );
    expect(mocks.add).not.toHaveBeenCalled();
  });

  it('uses an uploaded attachment when recording the Transaction', async () => {
    render(
      <BreezeProvider locale="en-GB">
        <TransferSubmissionHarness
          transfer={Promise.resolve({
            path: 'company-id/uploaded-invoice.pdf',
            status: 'uploaded',
          })}
        />
      </BreezeProvider>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Submit with attachment transfer' }),
    );

    await waitFor(() => expect(mocks.add).toHaveBeenCalledOnce());
    expect(mutationInput(mocks.add)).toMatchObject({
      attachment: 'company-id/uploaded-invoice.pdf',
    });
  });

  it('does not save after the attachment transfer is cancelled', async () => {
    render(
      <BreezeProvider locale="en-GB">
        <TransferSubmissionHarness
          transfer={Promise.resolve({ status: 'cancelled' })}
        />
      </BreezeProvider>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Submit with attachment transfer' }),
    );

    await waitFor(() => expect(mocks.shouldBlockFn?.()).toBe(false));
    expect(mocks.add).not.toHaveBeenCalled();
  });

  it.each([
    ['record', Harness, 'add'],
    ['update', EditHarness, 'update'],
  ] as const)(
    'keeps the form open when a %s mutation returns no Transaction',
    async (_, TestHarness, mutation) => {
      mocks[mutation].mockResolvedValueOnce({ data: null });

      render(
        <BreezeProvider locale="en-GB">
          <TestHarness />
        </BreezeProvider>,
      );

      await userEvent.click(
        screen.getByRole('button', {
          name:
            mutation === 'add' ? 'Submit valid refund' : 'Confirm transaction',
        }),
      );

      await waitFor(() =>
        expect(mocks.toast.show).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Transaction could not be saved',
          }),
        ),
      );
      expect(mocks.navigate).not.toHaveBeenCalled();
    },
  );

  it('keeps staged attachment ownership when cleanup fails', async () => {
    mocks.deleteFile.mockResolvedValueOnce({ data: null });

    render(
      <BreezeProvider locale="en-GB">
        <DiscardStagedAttachmentHarness />
      </BreezeProvider>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Stage attachment' }),
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Discard changes' }),
    );

    await waitFor(() =>
      expect(mocks.toast.show).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Attachment cleanup failed' }),
      ),
    );
    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  it('keeps the form open when close-time staged attachment cleanup fails', async () => {
    mocks.deleteFile.mockResolvedValueOnce({ data: null });

    render(
      <BreezeProvider locale="en-GB">
        <CloseWithStagedAttachmentHarness />
      </BreezeProvider>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Stage before close' }),
    );
    await waitFor(() => expect(mocks.shouldBlockFn?.()).toBe(false));
    await userEvent.click(
      screen.getByRole('button', { name: 'Close with staged attachment' }),
    );

    await waitFor(() => expect(mocks.deleteFile).toHaveBeenCalledOnce());
    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  it('leaves a persisted attachment for the Transaction save operation', async () => {
    render(
      <BreezeProvider locale="en-GB">
        <RemovePersistedAttachmentHarness />
      </BreezeProvider>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Remove persisted attachment' }),
    );

    expect(
      await screen.findByText('Persisted attachment retained for save'),
    ).toBeVisible();
    expect(mocks.deleteFile).not.toHaveBeenCalled();
  });

  it('returns a new Pending Transaction to the Pending collection when closed', async () => {
    render(
      <BreezeProvider locale="en-GB">
        <PendingCloseHarness />
      </BreezeProvider>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Close Pending Transaction' }),
    );

    expect(mocks.navigate).toHaveBeenCalledWith({
      params: { companyId: 'company-id' },
      to: '/my-companies/accounts/$companyId/pending-transactions',
    });
  });

  it('settles a rejected attachment transfer without blocking navigation forever', async () => {
    render(
      <BreezeProvider locale="en-GB">
        <RejectedTransferHarness />
      </BreezeProvider>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Start rejected transfer' }),
    );

    expect(await screen.findByText('Transfer settled')).toBeVisible();
  });

  it('does not navigate when a rejected transfer cannot be discarded', async () => {
    render(
      <BreezeProvider locale="en-GB">
        <RejectingDiscardHarness />
      </BreezeProvider>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Start failed staged transfer' }),
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Discard failed transfer' }),
    );

    await waitFor(() => expect(mocks.shouldBlockFn?.()).toBe(true));
    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  it('does not let a superseded transfer claim the staged attachment', async () => {
    let resolveFirst: (value: {
      path: string;
      status: 'uploaded';
    }) => void = () => undefined;
    const firstTransfer = new Promise<{ path: string; status: 'uploaded' }>(
      (resolve) => {
        resolveFirst = resolve;
      },
    );

    render(
      <BreezeProvider locale="en-GB">
        <SupersededTransferHarness firstTransfer={firstTransfer} />
      </BreezeProvider>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Start first transfer' }),
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Supersede transfer' }),
    );
    resolveFirst({ path: 'company-id/first.pdf', status: 'uploaded' });
    await userEvent.click(
      screen.getByRole('button', { name: 'Remove superseded attachment' }),
    );

    expect(
      await screen.findByText('Superseded attachment ignored'),
    ).toBeVisible();
    expect(mocks.deleteFile).not.toHaveBeenCalled();
  });

  it('blocks route navigation while an attachment transfer is pending', async () => {
    render(
      <BreezeProvider locale="en-GB">
        <PendingTransferHarness />
      </BreezeProvider>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Start attachment transfer' }),
    );

    expect(mocks.shouldBlockFn?.()).toBe(true);
  });
});
