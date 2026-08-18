import { BreezeProvider } from '@motech-development/breeze-ui';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AttachmentUpload } from './AttachmentUpload';

const mocks = vi.hoisted(() => ({
  capturePresignedTransferFailure: vi.fn(),
  requestUpload: vi.fn(),
  toast: { show: vi.fn() },
  uploadPresignedFile: vi.fn(),
}));

vi.mock('../../observability', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../observability')>()),
  capturePresignedTransferFailure: mocks.capturePresignedTransferFailure,
}));

vi.mock('@apollo/client/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client/react')>()),
  useMutation: () => [mocks.requestUpload, { loading: false }],
}));

vi.mock('@motech-development/breeze-ui', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@motech-development/breeze-ui')>()),
  useToast: () => mocks.toast,
}));

vi.mock('../../data/presigned-transfer', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../data/presigned-transfer')>()),
  uploadPresignedFile: mocks.uploadPresignedFile,
}));

describe('AttachmentUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lets the latest file selection own the completed upload', async () => {
    const user = userEvent.setup();
    const onUploaded = vi.fn();
    const firstFile = new File(['first'], 'first.pdf', {
      type: 'application/pdf',
    });
    const secondFile = new File(['second'], 'second.pdf', {
      type: 'application/pdf',
    });

    mocks.requestUpload
      .mockResolvedValueOnce({
        data: {
          requestUpload: { id: 'upload-1', url: 'https://upload/first' },
        },
      })
      .mockResolvedValueOnce({
        data: {
          requestUpload: { id: 'upload-2', url: 'https://upload/second' },
        },
      });
    mocks.uploadPresignedFile
      .mockImplementationOnce(
        (_url: string, _file: File, signal: AbortSignal) =>
          new Promise<void>((_resolve, reject) => {
            signal.addEventListener('abort', () => {
              reject(new DOMException('Superseded', 'AbortError'));
            });
          }),
      )
      .mockResolvedValueOnce(undefined);

    render(
      <BreezeProvider locale="en-GB">
        <AttachmentUpload
          companyId="company-1"
          onTransfer={vi.fn()}
          onUploaded={onUploaded}
        />
      </BreezeProvider>,
    );

    const input = document.querySelector('input[type="file"]');

    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByText('PDF, JPG or PNG')).toBeVisible();
    await user.upload(input as HTMLInputElement, firstFile);
    await waitFor(() => {
      expect(mocks.uploadPresignedFile).toHaveBeenCalledTimes(1);
    });
    await user.upload(input as HTMLInputElement, secondFile);

    await waitFor(() => {
      expect(onUploaded).toHaveBeenCalledWith('company-1/upload-2.pdf');
    });
    expect(mocks.requestUpload).toHaveBeenNthCalledWith(2, {
      variables: {
        id: 'company-1',
        input: {
          contentType: 'application/pdf',
          extension: 'pdf',
          metadata: { typename: 'Transaction' },
        },
      },
    });
    expect(onUploaded).toHaveBeenCalledTimes(1);
    expect(mocks.toast.show).not.toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'danger' }),
    );
  });

  it('preserves image type, extension, and Transaction metadata', async () => {
    const user = userEvent.setup();
    const file = new File(['image'], 'receipt.jpg', { type: 'image/jpeg' });
    const onUploaded = vi.fn();

    mocks.requestUpload.mockResolvedValue({
      data: {
        requestUpload: { id: 'upload-image', url: 'https://upload/image' },
      },
    });
    mocks.uploadPresignedFile.mockResolvedValue(undefined);

    render(
      <BreezeProvider locale="en-GB">
        <AttachmentUpload
          companyId="company-1"
          onTransfer={vi.fn()}
          onUploaded={onUploaded}
          transactionId="transaction-1"
        />
      </BreezeProvider>,
    );

    await user.upload(
      document.querySelector('input[type="file"]') as HTMLInputElement,
      file,
    );

    await waitFor(() => {
      expect(onUploaded).toHaveBeenCalledWith('company-1/upload-image.jpg');
    });
    expect(mocks.requestUpload).toHaveBeenCalledWith({
      variables: {
        id: 'company-1',
        input: {
          contentType: 'image/jpeg',
          extension: 'jpg',
          metadata: { id: 'transaction-1', typename: 'Transaction' },
        },
      },
    });
  });

  it('uses the media type extension when the selected filename has none', async () => {
    const user = userEvent.setup();
    const file = new File(['image'], 'receipt', { type: 'image/png' });

    mocks.requestUpload.mockResolvedValue({
      data: {
        requestUpload: { id: 'upload-image', url: 'https://upload/image' },
      },
    });
    mocks.uploadPresignedFile.mockResolvedValue(undefined);

    render(
      <BreezeProvider locale="en-GB">
        <AttachmentUpload
          companyId="company-1"
          onTransfer={vi.fn()}
          onUploaded={vi.fn()}
        />
      </BreezeProvider>,
    );

    await user.upload(
      document.querySelector('input[type="file"]') as HTMLInputElement,
      file,
    );

    await waitFor(() => {
      expect(mocks.requestUpload).toHaveBeenCalledWith({
        variables: {
          id: 'company-1',
          input: {
            contentType: 'image/png',
            extension: 'png',
            metadata: { typename: 'Transaction' },
          },
        },
      });
    });
  });

  it('rejects a file outside the attachment media contract', async () => {
    const transfer = vi.fn();
    const file = new File(['notes'], 'notes.txt', { type: 'text/plain' });

    render(
      <BreezeProvider locale="en-GB">
        <AttachmentUpload
          companyId="company-1"
          onTransfer={transfer}
          onUploaded={vi.fn()}
        />
      </BreezeProvider>,
    );

    fireEvent.change(
      document.querySelector('input[type="file"]') as HTMLInputElement,
      { target: { files: [file] } },
    );

    await waitFor(() =>
      expect(mocks.toast.show).toHaveBeenCalledWith({
        description: 'Choose one PDF, GIF, JPG, or PNG file.',
        title: 'File not accepted',
        variant: 'warning',
      }),
    );
    expect(transfer).not.toHaveBeenCalled();
    expect(mocks.requestUpload).not.toHaveBeenCalled();
  });

  it('preserves GIF attachments supported by the Transaction storage contract', async () => {
    const user = userEvent.setup();
    const file = new File(['image'], 'receipt.gif', { type: 'image/gif' });

    mocks.requestUpload.mockResolvedValue({
      data: {
        requestUpload: { id: 'upload-gif', url: 'https://upload/gif' },
      },
    });
    mocks.uploadPresignedFile.mockResolvedValue(undefined);

    render(
      <BreezeProvider locale="en-GB">
        <AttachmentUpload
          companyId="company-1"
          onTransfer={vi.fn()}
          onUploaded={vi.fn()}
        />
      </BreezeProvider>,
    );

    await user.upload(
      document.querySelector('input[type="file"]') as HTMLInputElement,
      file,
    );

    await waitFor(() => {
      expect(mocks.requestUpload).toHaveBeenCalledWith({
        variables: {
          id: 'company-1',
          input: {
            contentType: 'image/gif',
            extension: 'gif',
            metadata: { typename: 'Transaction' },
          },
        },
      });
    });
  });

  it('preserves the selected PDF and retries it after transfer failure', async () => {
    const user = userEvent.setup();
    const onUploaded = vi.fn();
    const file = new File(['invoice'], 'invoice.pdf', {
      type: 'application/pdf',
    });

    mocks.requestUpload
      .mockResolvedValueOnce({
        data: {
          requestUpload: { id: 'upload-1', url: 'https://upload/first' },
        },
      })
      .mockResolvedValueOnce({
        data: {
          requestUpload: { id: 'upload-2', url: 'https://upload/retry' },
        },
      });
    mocks.uploadPresignedFile
      .mockRejectedValueOnce(new Error('Transfer failed'))
      .mockResolvedValueOnce(undefined);

    render(
      <BreezeProvider locale="en-GB">
        <AttachmentUpload
          companyId="company-1"
          onTransfer={vi.fn()}
          onUploaded={onUploaded}
        />
      </BreezeProvider>,
    );

    const input = document.querySelector('input[type="file"]');

    expect(input).toBeInstanceOf(HTMLInputElement);
    await user.upload(input as HTMLInputElement, file);

    const retry = await screen.findByRole('button', { name: 'Retry upload' });

    expect(screen.getByText('invoice.pdf')).toBeVisible();
    await user.click(retry);

    await waitFor(() => {
      expect(onUploaded).toHaveBeenCalledWith('company-1/upload-2.pdf');
    });
    expect(mocks.uploadPresignedFile).toHaveBeenNthCalledWith(
      2,
      'https://upload/retry',
      file,
      expect.any(AbortSignal),
    );
  });

  it('reports a missing presigned upload destination', async () => {
    const user = userEvent.setup();
    const file = new File(['invoice'], 'invoice.pdf', {
      type: 'application/pdf',
    });

    mocks.requestUpload.mockResolvedValue({ data: { requestUpload: null } });

    render(
      <BreezeProvider locale="en-GB">
        <AttachmentUpload
          companyId="company-1"
          onTransfer={vi.fn()}
          onUploaded={vi.fn()}
        />
      </BreezeProvider>,
    );

    const input = document.querySelector('input[type="file"]');

    expect(input).toBeInstanceOf(HTMLInputElement);
    await user.upload(input as HTMLInputElement, file);

    await waitFor(() => {
      expect(mocks.capturePresignedTransferFailure).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'No upload destination was returned',
        }),
        'Upload',
      );
    });
    expect(
      await screen.findByRole('button', { name: 'Retry upload' }),
    ).toBeVisible();
  });
});
