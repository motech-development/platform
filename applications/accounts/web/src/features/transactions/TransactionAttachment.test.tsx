import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TransactionAttachment } from './TransactionAttachment';

const mocks = vi.hoisted(() => ({
  capture: vi.fn(),
  createObjectUrl: vi.fn(() => 'blob:attachment-preview'),
  download: vi.fn(),
  online: true,
  query: vi.fn(),
  revokeObjectUrl: vi.fn(),
  saveAs: vi.fn(),
  toast: { show: vi.fn() },
}));
const transactionDrawerRef = { current: document.createElement('section') };

vi.mock('@apollo/client/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client/react')>()),
  useApolloClient: () => ({ query: mocks.query }),
}));

vi.mock('@motech-development/breeze-ui', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@motech-development/breeze-ui')>()),
  useToast: () => mocks.toast,
}));

vi.mock('../../observability', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../observability')>()),
  capturePresignedTransferFailure: mocks.capture,
}));

vi.mock('../../data/presigned-transfer', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../data/presigned-transfer')>()),
  downloadPresignedFile: mocks.download,
}));

vi.mock('file-saver', async (importOriginal) => ({
  ...(await importOriginal<typeof import('file-saver')>()),
  saveAs: mocks.saveAs,
}));

vi.mock('../../pwa/connectivity', () => ({
  useOnlineStatus: () => mocks.online,
}));

vi.mock('./PdfPreview', () => ({
  PdfPreview: ({ file }: { file: Blob }) => <p>PDF preview: {file.type}</p>,
}));

describe('TransactionAttachment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.online = true;
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: mocks.createObjectUrl,
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: mocks.revokeObjectUrl,
    });
  });

  it('reports a missing presigned download without losing the attachment', async () => {
    mocks.query.mockResolvedValue({ data: { requestDownload: { url: null } } });

    render(
      <BreezeProvider locale="en-GB">
        <TransactionAttachment
          companyId="company-id"
          onDeleted={() => true}
          onReplace={() => undefined}
          path="company-id/invoice.pdf"
          transactionDrawerRef={transactionDrawerRef}
        />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'View file' }));

    await waitFor(() =>
      expect(mocks.capture).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'No download destination was returned',
        }),
        'Download',
      ),
    );
    expect(screen.getByText('invoice.pdf')).toBeVisible();
    expect(mocks.toast.show).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'danger' }),
    );
  });

  it('marks a persisted attachment for deletion without deleting it immediately', async () => {
    const onDeleted = vi.fn(() => true);

    render(
      <BreezeProvider locale="en-GB">
        <TransactionAttachment
          companyId="company-id"
          onDeleted={onDeleted}
          onReplace={() => undefined}
          path="company-id/receipt.png"
          transactionDrawerRef={transactionDrawerRef}
        />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Delete file' }));

    expect(onDeleted).toHaveBeenCalledOnce();
  });

  it('presents a nontechnical name for generated attachment storage keys', async () => {
    const file = new Blob(['invoice'], { type: 'application/pdf' });

    mocks.query.mockResolvedValue({
      data: { requestDownload: { url: 'https://download/invoice' } },
    });
    mocks.download.mockResolvedValue(file);

    render(
      <BreezeProvider locale="en-GB">
        <TransactionAttachment
          companyId="company-id"
          onDeleted={() => true}
          onReplace={() => undefined}
          path="company-id/3456df4a-51f8-49af-a52e-c1a21b8ff087.pdf"
          transactionDrawerRef={transactionDrawerRef}
        />
      </BreezeProvider>,
    );

    expect(screen.getByText('Transaction attachment.pdf')).toBeVisible();
    expect(
      screen.queryByText('3456df4a-51f8-49af-a52e-c1a21b8ff087.pdf'),
    ).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'View file' }));
    await screen.findByText('PDF preview: application/pdf');
    await userEvent.click(
      screen.getByRole('button', { name: 'Download file' }),
    );

    await waitFor(() =>
      expect(mocks.saveAs).toHaveBeenCalledWith(
        file,
        'Transaction attachment.pdf',
      ),
    );
  });

  it('opens a downloaded PDF and reuses it for the preview download', async () => {
    const file = new Blob(['invoice'], { type: 'application/pdf' });

    mocks.query.mockResolvedValue({
      data: { requestDownload: { url: 'https://download/invoice' } },
    });
    mocks.download.mockResolvedValue(file);

    render(
      <BreezeProvider locale="en-GB">
        <TransactionAttachment
          companyId="company-id"
          onDeleted={() => true}
          onReplace={() => undefined}
          path="company-id/invoice.pdf"
          transactionDrawerRef={transactionDrawerRef}
        />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'View file' }));

    expect(
      await screen.findByText('PDF preview: application/pdf'),
    ).toBeVisible();
    await userEvent.click(
      screen.getByRole('button', { name: 'Download file' }),
    );
    expect(mocks.saveAs).toHaveBeenCalledWith(file, 'invoice.pdf');
    expect(mocks.download).toHaveBeenCalledOnce();
    expect(mocks.toast.show).toHaveBeenCalledWith({
      title: 'The download has started',
      variant: 'success',
    });
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(
      screen.queryByText('PDF preview: application/pdf'),
    ).not.toBeInTheDocument();
  });

  it('downloads a replaced attachment instead of reusing the previous file', async () => {
    const original = new Blob(['original'], { type: 'application/pdf' });
    const replacement = new Blob(['replacement'], { type: 'application/pdf' });

    mocks.query
      .mockResolvedValueOnce({
        data: { requestDownload: { url: 'https://download/original' } },
      })
      .mockResolvedValueOnce({
        data: { requestDownload: { url: 'https://download/replacement' } },
      });
    mocks.download
      .mockResolvedValueOnce(original)
      .mockResolvedValueOnce(replacement);

    const view = render(
      <BreezeProvider locale="en-GB">
        <TransactionAttachment
          companyId="company-id"
          onDeleted={() => true}
          onReplace={() => undefined}
          path="company-id/original.pdf"
          transactionDrawerRef={transactionDrawerRef}
        />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'View file' }));
    await screen.findByText('PDF preview: application/pdf');

    view.rerender(
      <BreezeProvider locale="en-GB">
        <TransactionAttachment
          companyId="company-id"
          onDeleted={() => true}
          onReplace={() => undefined}
          path="company-id/replacement.pdf"
          transactionDrawerRef={transactionDrawerRef}
        />
      </BreezeProvider>,
    );

    expect(
      screen.queryByText('PDF preview: application/pdf'),
    ).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'View file' }));
    await screen.findByText('PDF preview: application/pdf');
    await userEvent.click(
      screen.getByRole('button', { name: 'Download file' }),
    );

    expect(mocks.download).toHaveBeenCalledTimes(2);
    expect(mocks.saveAs).toHaveBeenCalledWith(replacement, 'replacement.pdf');
  });

  it('opens a GIF preview and releases its object URL when closed', async () => {
    const file = new Blob(['image'], { type: 'image/gif' });

    mocks.query.mockResolvedValue({
      data: { requestDownload: { url: 'https://download/receipt' } },
    });
    mocks.download.mockResolvedValue(file);

    const view = render(
      <BreezeProvider locale="en-GB">
        <TransactionAttachment
          companyId="company-id"
          onDeleted={() => true}
          onReplace={() => undefined}
          path="company-id/receipt.gif"
          transactionDrawerRef={transactionDrawerRef}
        />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'View file' }));

    expect(
      await screen.findByRole('img', { name: 'receipt.gif' }),
    ).toHaveAttribute('src', 'blob:attachment-preview');
    view.unmount();
    expect(mocks.revokeObjectUrl).toHaveBeenCalledWith(
      'blob:attachment-preview',
    );
  });

  it.each([
    ['declines', false],
    ['rejects', new Error('Delete failed')],
  ] as const)(
    'restores the delete action when deletion %s',
    async (_, outcome) => {
      const onDeleted = vi.fn(() =>
        outcome instanceof Error ? Promise.reject(outcome) : outcome,
      );

      render(
        <BreezeProvider locale="en-GB">
          <TransactionAttachment
            companyId="company-id"
            onDeleted={onDeleted}
            onReplace={() => undefined}
            path="company-id/invoice.pdf"
            transactionDrawerRef={transactionDrawerRef}
          />
        </BreezeProvider>,
      );

      const deleteButton = screen.getByRole('button', { name: 'Delete file' });

      await userEvent.click(deleteButton);
      await waitFor(() => expect(deleteButton).toBeEnabled());
      expect(screen.getByText('invoice.pdf')).toBeVisible();
    },
  );

  it('restores the delete action when deletion throws synchronously', async () => {
    const onDeleted = vi.fn(() => {
      throw new Error('Delete failed');
    });

    render(
      <BreezeProvider locale="en-GB">
        <TransactionAttachment
          companyId="company-id"
          onDeleted={onDeleted}
          onReplace={() => undefined}
          path="company-id/invoice.pdf"
          transactionDrawerRef={transactionDrawerRef}
        />
      </BreezeProvider>,
    );

    const deleteButton = screen.getByRole('button', { name: 'Delete file' });

    await userEvent.click(deleteButton);
    await waitFor(() => expect(deleteButton).toBeEnabled());
    expect(screen.getByText('invoice.pdf')).toBeVisible();
  });

  it('does not overlap attachment view and delete operations', async () => {
    const file = new Blob(['invoice'], { type: 'application/pdf' });
    let resolveDeletion!: (deleted: boolean) => void;
    let resolveDownload!: (file: Blob) => void;
    const deletion = new Promise<boolean>((resolve) => {
      resolveDeletion = resolve;
    });
    const download = new Promise<Blob>((resolve) => {
      resolveDownload = resolve;
    });

    mocks.query.mockResolvedValue({
      data: { requestDownload: { url: 'https://download/invoice' } },
    });
    mocks.download.mockReturnValue(download);

    render(
      <BreezeProvider locale="en-GB">
        <TransactionAttachment
          companyId="company-id"
          onDeleted={() => deletion}
          onReplace={() => undefined}
          path="company-id/invoice.pdf"
          transactionDrawerRef={transactionDrawerRef}
        />
      </BreezeProvider>,
    );

    const deleteButton = screen.getByRole('button', { name: 'Delete file' });
    const viewButton = screen.getByRole('button', { name: 'View file' });

    await userEvent.click(viewButton);
    expect(deleteButton).toBeDisabled();
    resolveDownload(file);
    await screen.findByText('PDF preview: application/pdf');
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(deleteButton).toBeEnabled());

    await userEvent.click(deleteButton);
    expect(viewButton).toBeDisabled();
    resolveDeletion(false);
    await waitFor(() => expect(viewButton).toBeEnabled());
  });

  it('requires a connection before attachment actions are available', () => {
    mocks.online = false;

    render(
      <BreezeProvider locale="en-GB">
        <TransactionAttachment
          companyId="company-id"
          onDeleted={() => true}
          onReplace={() => undefined}
          path="company-id/invoice.pdf"
          transactionDrawerRef={transactionDrawerRef}
        />
      </BreezeProvider>,
    );

    expect(
      screen.getByRole('button', { name: 'Connection required' }),
    ).toBeDisabled();
    expect(
      screen.queryByRole('button', { name: 'Download file' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete file' })).toBeDisabled();
  });
});
