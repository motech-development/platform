import { capturePresignedTransferFailure } from '../observability';

function assertSuccessful(response: Response, operation: string) {
  if (!response.ok) {
    throw new Error(`${operation} failed with status ${response.status}`);
  }
}

function isCancellation(cause: unknown, signal?: AbortSignal) {
  return (
    signal?.aborted ||
    (cause instanceof DOMException && cause.name === 'AbortError')
  );
}

async function transferPresignedObject(
  operation: 'Download' | 'Upload',
  url: string,
  init: RequestInit,
  signal?: AbortSignal,
) {
  try {
    const response = await globalThis.fetch(url, init);

    assertSuccessful(response, operation);
    return response;
  } catch (cause: unknown) {
    if (!isCancellation(cause, signal)) {
      capturePresignedTransferFailure(cause, operation);
    }

    throw cause;
  }
}

export async function uploadPresignedFile(
  url: string,
  file: File,
  signal?: AbortSignal,
): Promise<void> {
  if (!file.type) {
    throw new Error('The selected file must have a content type');
  }

  await transferPresignedObject(
    'Upload',
    url,
    {
      body: file,
      credentials: 'omit',
      headers: {
        'Content-Type': file.type,
      },
      method: 'PUT',
      mode: 'cors',
      ...(signal ? { signal } : {}),
    },
    signal,
  );
}

export async function downloadPresignedFile(
  url: string,
  signal?: AbortSignal,
): Promise<Blob> {
  const response = await transferPresignedObject(
    'Download',
    url,
    {
      credentials: 'omit',
      method: 'GET',
      mode: 'cors',
      ...(signal ? { signal } : {}),
    },
    signal,
  );

  return response.blob();
}
