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

vi.mock('file-saver', () => ({ saveAs: mocks.saveAs }));

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
          path="company-id/invoice.pdf"
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
          path="company-id/receipt.png"
        />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Delete file' }));

    expect(onDeleted).toHaveBeenCalledOnce();
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
          path="company-id/invoice.pdf"
        />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'View file' }));

    expect(
      await screen.findByText('PDF preview: application/pdf'),
    ).toBeVisible();
    await userEvent.click(
      screen.getAllByRole('button', { name: 'Download file' }).at(-1)!,
    );
    expect(mocks.saveAs).toHaveBeenCalledWith(file, 'invoice.pdf');
    expect(mocks.download).toHaveBeenCalledOnce();
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(
      screen.queryByText('PDF preview: application/pdf'),
    ).not.toBeInTheDocument();
  });

  it('opens an image preview and releases its object URL when closed', async () => {
    const file = new Blob(['image'], { type: 'image/png' });

    mocks.query.mockResolvedValue({
      data: { requestDownload: { url: 'https://download/receipt' } },
    });
    mocks.download.mockResolvedValue(file);

    const view = render(
      <BreezeProvider locale="en-GB">
        <TransactionAttachment
          companyId="company-id"
          onDeleted={() => true}
          path="company-id/receipt.png"
        />
      </BreezeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'View file' }));

    expect(
      await screen.findByRole('img', { name: 'receipt.png' }),
    ).toHaveAttribute('src', 'blob:attachment-preview');
    view.unmount();
    expect(mocks.revokeObjectUrl).toHaveBeenCalledWith(
      'blob:attachment-preview',
    );
  });

  it('downloads the attachment without opening its preview', async () => {
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
          path="company-id/invoice.pdf"
        />
      </BreezeProvider>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Download file' }),
    );

    await waitFor(() =>
      expect(mocks.saveAs).toHaveBeenCalledWith(file, 'invoice.pdf'),
    );
  });

  it('reports a failed direct download without removing the attachment', async () => {
    mocks.query.mockResolvedValue({
      data: { requestDownload: { url: 'https://download/invoice' } },
    });
    mocks.download.mockRejectedValue(new Error('Download failed'));

    render(
      <BreezeProvider locale="en-GB">
        <TransactionAttachment
          companyId="company-id"
          onDeleted={() => true}
          path="company-id/invoice.pdf"
        />
      </BreezeProvider>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Download file' }),
    );

    await waitFor(() =>
      expect(mocks.toast.show).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Attachment unavailable' }),
      ),
    );
    expect(screen.getByText('invoice.pdf')).toBeVisible();
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
            path="company-id/invoice.pdf"
          />
        </BreezeProvider>,
      );

      const deleteButton = screen.getByRole('button', { name: 'Delete file' });

      await userEvent.click(deleteButton);
      await waitFor(() => expect(deleteButton).toBeEnabled());
      expect(screen.getByText('invoice.pdf')).toBeVisible();
    },
  );

  it('requires a connection before attachment actions are available', () => {
    mocks.online = false;

    render(
      <BreezeProvider locale="en-GB">
        <TransactionAttachment
          companyId="company-id"
          onDeleted={() => true}
          path="company-id/invoice.pdf"
        />
      </BreezeProvider>,
    );

    expect(
      screen.getByRole('button', { name: 'Connection required' }),
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Download file' }),
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Delete file' })).toBeDisabled();
  });
});
