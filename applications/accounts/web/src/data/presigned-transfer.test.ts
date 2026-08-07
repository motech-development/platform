import {
  downloadPresignedFile,
  uploadPresignedFile,
} from './presigned-transfer';

const mocks = vi.hoisted(() => {
  const capturePresignedTransferFailure = vi.fn();
  const fetch = vi.fn();

  vi.stubGlobal('fetch', fetch);

  return { capturePresignedTransferFailure, fetch };
});

vi.mock('../observability', () => ({
  capturePresignedTransferFailure: mocks.capturePresignedTransferFailure,
}));

describe('presigned object transfer', () => {
  beforeEach(() => {
    mocks.capturePresignedTransferFailure.mockReset();
    mocks.fetch.mockReset();
    vi.stubGlobal('fetch', mocks.fetch);
  });

  it('uploads the exact file type without credentials or authorization', async () => {
    mocks.fetch.mockResolvedValue(new Response(null, { status: 200 }));
    const file = new File(['pdf'], 'invoice.pdf', {
      type: 'application/pdf',
    });

    await uploadPresignedFile('https://storage.example/upload', file);

    expect(mocks.fetch).toHaveBeenCalledWith('https://storage.example/upload', {
      body: file,
      credentials: 'omit',
      headers: { 'Content-Type': 'application/pdf' },
      method: 'PUT',
      mode: 'cors',
    });
  });

  it('downloads through an anonymous GET', async () => {
    const blob = new Blob(['pdf'], { type: 'application/pdf' });

    mocks.fetch.mockResolvedValue(new Response(blob, { status: 200 }));

    await expect(
      downloadPresignedFile('https://storage.example/download'),
    ).resolves.toEqual(blob);
    expect(mocks.fetch).toHaveBeenCalledWith(
      'https://storage.example/download',
      {
        credentials: 'omit',
        method: 'GET',
        mode: 'cors',
      },
    );
  });

  it('passes identity-lifecycle cancellation to a transfer', async () => {
    mocks.fetch.mockResolvedValue(new Response(null, { status: 200 }));
    const controller = new AbortController();
    const file = new File(['pdf'], 'invoice.pdf', {
      type: 'application/pdf',
    });

    await uploadPresignedFile(
      'https://storage.example/upload',
      file,
      controller.signal,
    );

    expect(mocks.fetch).toHaveBeenCalledWith(
      'https://storage.example/upload',
      expect.objectContaining({ signal: controller.signal }),
    );
  });

  it('uses fetch instrumentation added after the transfer module loads', async () => {
    const instrumentedFetch = vi.fn();
    const file = new File(['pdf'], 'invoice.pdf', {
      type: 'application/pdf',
    });

    instrumentedFetch.mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal('fetch', instrumentedFetch);

    await uploadPresignedFile(
      'https://storage.example/upload?X-Amz-Signature=secret',
      file,
    );

    expect(instrumentedFetch).toHaveBeenCalledOnce();
    expect(mocks.fetch).not.toHaveBeenCalled();
  });

  it('reports a transfer failure without swallowing the original error', async () => {
    const failure = new Error('Storage connection failed');
    const instrumentedFetch = vi.fn().mockRejectedValue(failure);
    const file = new File(['pdf'], 'invoice.pdf', {
      type: 'application/pdf',
    });

    vi.stubGlobal('fetch', instrumentedFetch);

    await expect(
      uploadPresignedFile('https://storage.example/upload', file),
    ).rejects.toBe(failure);
    expect(mocks.capturePresignedTransferFailure).toHaveBeenCalledWith(
      failure,
      'Upload',
    );
  });

  it('does not report an intentional transfer cancellation', async () => {
    const cancellation = new DOMException('Aborted', 'AbortError');
    const instrumentedFetch = vi.fn().mockRejectedValue(cancellation);
    const controller = new AbortController();
    const file = new File(['pdf'], 'invoice.pdf', {
      type: 'application/pdf',
    });

    controller.abort();
    vi.stubGlobal('fetch', instrumentedFetch);

    await expect(
      uploadPresignedFile(
        'https://storage.example/upload',
        file,
        controller.signal,
      ),
    ).rejects.toBe(cancellation);
    expect(mocks.capturePresignedTransferFailure).not.toHaveBeenCalled();
  });
});
