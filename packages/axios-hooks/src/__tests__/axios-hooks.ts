import { ReadableStream as NodeReadableStream } from 'node:stream/web';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useGet, useLazyGet, usePost, usePut } from '../axios-hooks';

interface IMockResponseOptions {
  body?: Blob | string;
  contentType?: string;
  ok?: boolean;
  status?: number;
  statusText?: string;
}

const createResponse = ({
  body = '',
  contentType,
  ok = true,
  status = 200,
  statusText = '',
}: IMockResponseOptions = {}) => ({
  arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
  blob: jest.fn().mockResolvedValue(body),
  headers: {
    get: jest.fn((name: string) =>
      name.toLowerCase() === 'content-type' ? contentType : undefined,
    ),
  },
  ok,
  status,
  statusText,
  text: jest.fn().mockResolvedValue(typeof body === 'string' ? body : ''),
});

describe('axios-hooks', () => {
  const body = {
    email: 'test@tester.com',
    name: 'Tester',
  };
  const failure = {
    success: false,
  };
  const success = {
    success: true,
  };

  let fetch: jest.Mock;
  let onCompleted: jest.Mock;
  let onError: jest.Mock;

  beforeEach(() => {
    fetch = jest.fn();
    global.fetch = fetch;
    onCompleted = jest.fn();
    onError = jest.fn();
  });

  describe('when response is successful', () => {
    beforeEach(() => {
      fetch.mockResolvedValue(
        createResponse({
          body: JSON.stringify(success),
          contentType: 'application/json',
        }),
      );
    });

    describe('useGet', () => {
      it('should make the correct request', async () => {
        renderHook(() =>
          useGet('/get', {
            headers: {
              'Content-Type': 'text/html',
            },
            responseType: 'text',
          }),
        );

        await waitFor(() =>
          expect(fetch).toHaveBeenCalledWith('/get', {
            body: undefined,
            headers: {
              'Content-Type': 'text/html',
            },
            method: 'GET',
          }),
        );
      });

      it('should return the correct response', async () => {
        const { result } = renderHook(() => useGet('/get'));

        await waitFor(() =>
          expect(result.current).toEqual({
            data: success,
            error: undefined,
            loading: false,
          }),
        );
      });

      it('should call onSuccess callback', async () => {
        renderHook(() =>
          useGet('/get', {
            onCompleted,
          }),
        );

        await waitFor(() => expect(onCompleted).toHaveBeenCalledWith(success));
      });
    });

    describe('useLazyGet', () => {
      it('should make the correct request', async () => {
        const { result } = renderHook(() =>
          useLazyGet({
            headers: {
              'Content-Type': 'text/html',
            },
            responseType: 'text',
          }),
        );
        const [execute] = result.current;

        await act(async () => {
          await execute('/get', {
            Authorization: 'bearer fgdskfgsdhjfgj',
          });
        });

        await waitFor(() =>
          expect(fetch).toHaveBeenCalledWith('/get', {
            body: undefined,
            headers: {
              Authorization: 'bearer fgdskfgsdhjfgj',
              'Content-Type': 'text/html',
            },
            method: 'GET',
          }),
        );
      });

      it('should return the correct response', async () => {
        const { result } = renderHook(() => useLazyGet());
        const [execute] = result.current;

        await act(async () => {
          await execute('/get');
        });

        const [, results] = result.current;

        await waitFor(() =>
          expect(results).toEqual({
            data: success,
            error: undefined,
            loading: false,
          }),
        );
      });

      it('should call onSuccess callback', async () => {
        const { result } = renderHook(() =>
          useLazyGet({
            onCompleted,
          }),
        );
        const [execute] = result.current;

        await act(async () => {
          await execute('/get');
        });

        await waitFor(() => expect(onCompleted).toHaveBeenCalledWith(success));
      });
    });

    describe('usePost', () => {
      it('should make the correct request', async () => {
        const { result } = renderHook(() =>
          usePost({
            headers: {
              'Content-Type': 'application/json',
            },
            responseType: 'json',
          }),
        );
        const [execute] = result.current;

        await act(async () => {
          await execute('/post', body, {
            Authorization: 'bearer fgdskfgsdhjfgj',
          });
        });

        await waitFor(() =>
          expect(fetch).toHaveBeenCalledWith('/post', {
            body: JSON.stringify(body),
            headers: {
              Authorization: 'bearer fgdskfgsdhjfgj',
              'Content-Type': 'application/json',
            },
            method: 'POST',
          }),
        );
      });

      it('should return the correct response', async () => {
        const { result } = renderHook(() => usePost());
        const [execute] = result.current;

        await act(async () => {
          await execute('/post', body);
        });

        const [, results] = result.current;

        await waitFor(() =>
          expect(results).toEqual({
            data: success,
            error: undefined,
            loading: false,
          }),
        );
      });

      it('should call onSuccess callback', async () => {
        const { result } = renderHook(() =>
          usePost({
            onCompleted,
          }),
        );
        const [execute] = result.current;

        await act(async () => {
          await execute('/post', body);
        });

        await waitFor(() => expect(onCompleted).toHaveBeenCalledWith(success));
      });
    });

    describe('usePut', () => {
      it('should make the correct request', async () => {
        const { result } = renderHook(() =>
          usePut({
            headers: {
              'Content-Type': 'application/json',
            },
            responseType: 'json',
          }),
        );
        const [execute] = result.current;

        await act(async () => {
          await execute('/put', body, {
            Authorization: 'bearer fgdskfgsdhjfgj',
          });
        });

        await waitFor(() =>
          expect(fetch).toHaveBeenCalledWith('/put', {
            body: JSON.stringify(body),
            headers: {
              Authorization: 'bearer fgdskfgsdhjfgj',
              'Content-Type': 'application/json',
            },
            method: 'PUT',
          }),
        );
      });

      it('should return the correct response', async () => {
        const { result } = renderHook(() => usePut());
        const [execute] = result.current;

        await act(async () => {
          await execute('/put', body);
        });

        const [, results] = result.current;

        await waitFor(() =>
          expect(results).toEqual({
            data: success,
            error: undefined,
            loading: false,
          }),
        );
      });

      it('should call onSuccess callback', async () => {
        const { result } = renderHook(() =>
          usePut({
            onCompleted,
          }),
        );
        const [execute] = result.current;

        await act(async () => {
          await execute('/put', body);
        });

        await waitFor(() => expect(onCompleted).toHaveBeenCalledWith(success));
      });

      it('should pass stream bodies through unchanged', async () => {
        const originalReadableStream = global.ReadableStream;
        global.ReadableStream =
          NodeReadableStream as unknown as typeof globalThis.ReadableStream;
        const stream = new NodeReadableStream();
        const { result } = renderHook(() => usePut());
        const [execute] = result.current;

        try {
          await act(async () => {
            await execute('/put', stream);
          });
        } finally {
          global.ReadableStream = originalReadableStream;
        }

        await waitFor(() =>
          expect(fetch).toHaveBeenCalledWith('/put', {
            body: stream,
            headers: {},
            method: 'PUT',
          }),
        );
      });
    });
  });

  describe('when response is not successful', () => {
    beforeEach(() => {
      fetch.mockResolvedValue(
        createResponse({
          body: JSON.stringify(failure),
          contentType: 'application/json',
          ok: false,
          status: 400,
          statusText: 'Bad Request',
        }),
      );
    });

    describe('useGet', () => {
      it('should return the correct response', async () => {
        const { result } = renderHook(() => useGet('/get'));

        await waitFor(() => {
          expect(result.current).toMatchObject({
            data: undefined,
            loading: false,
          });
          expect(result.current.error).toEqual(
            expect.objectContaining({
              response: {
                data: failure,
                status: 400,
                statusText: 'Bad Request',
              },
              status: 400,
            }),
          );
        });
      });

      it('should call onError callback', async () => {
        renderHook(() =>
          useGet('/get', {
            onError,
          }),
        );

        await waitFor(() =>
          expect(onError).toHaveBeenCalledWith(
            expect.objectContaining({
              response: {
                data: failure,
                status: 400,
                statusText: 'Bad Request',
              },
              status: 400,
            }),
          ),
        );
      });

      it('should preserve the status when error response parsing fails', async () => {
        fetch.mockResolvedValueOnce(
          createResponse({
            body: '{',
            contentType: 'application/json',
            ok: false,
            status: 500,
            statusText: 'Server Error',
          }),
        );

        const { result } = renderHook(() => useGet('/get'));

        await waitFor(() =>
          expect(result.current.error).toEqual(
            expect.objectContaining({
              response: {
                data: null,
                status: 500,
                statusText: 'Server Error',
              },
              status: 500,
            }),
          ),
        );
      });
    });

    describe('useLazyGet', () => {
      it('should return the correct response', async () => {
        const { result } = renderHook(() => useLazyGet());
        const [execute] = result.current;

        await act(async () => {
          await execute('/get');
        });

        const [, results] = result.current;

        await waitFor(() => {
          expect(results).toMatchObject({
            data: undefined,
            loading: false,
          });
          expect(results.error).toEqual(
            expect.objectContaining({
              response: {
                data: failure,
                status: 400,
                statusText: 'Bad Request',
              },
              status: 400,
            }),
          );
        });
      });

      it('should call onError callback', async () => {
        const { result } = renderHook(() =>
          useLazyGet({
            onError,
          }),
        );
        const [execute] = result.current;

        await act(async () => {
          await execute('/get');
        });

        await waitFor(() =>
          expect(onError).toHaveBeenCalledWith(
            expect.objectContaining({
              response: {
                data: failure,
                status: 400,
                statusText: 'Bad Request',
              },
              status: 400,
            }),
          ),
        );
      });
    });

    describe('usePost', () => {
      it('should return the correct response', async () => {
        const { result } = renderHook(() => usePost());
        const [execute] = result.current;

        await act(async () => {
          await execute('/post', body);
        });

        const [, results] = result.current;

        await waitFor(() => {
          expect(results).toMatchObject({
            data: undefined,
            loading: false,
          });
          expect(results.error).toEqual(
            expect.objectContaining({
              response: {
                data: failure,
                status: 400,
                statusText: 'Bad Request',
              },
              status: 400,
            }),
          );
        });
      });

      it('should call onError callback', async () => {
        const { result } = renderHook(() =>
          usePost({
            onError,
          }),
        );
        const [execute] = result.current;

        await act(async () => {
          await execute('/post', body);
        });

        await waitFor(() =>
          expect(onError).toHaveBeenCalledWith(
            expect.objectContaining({
              response: {
                data: failure,
                status: 400,
                statusText: 'Bad Request',
              },
              status: 400,
            }),
          ),
        );
      });
    });

    describe('usePut', () => {
      it('should return the correct response', async () => {
        const { result } = renderHook(() => usePut());
        const [execute] = result.current;

        await act(async () => {
          await execute('/put', body);
        });

        const [, results] = result.current;

        await waitFor(() => {
          expect(results).toMatchObject({
            data: undefined,
            loading: false,
          });
          expect(results.error).toEqual(
            expect.objectContaining({
              response: {
                data: failure,
                status: 400,
                statusText: 'Bad Request',
              },
              status: 400,
            }),
          );
        });
      });

      it('should call onError callback', async () => {
        const { result } = renderHook(() =>
          usePut({
            onError,
          }),
        );
        const [execute] = result.current;

        await act(async () => {
          await execute('/put', body);
        });

        await waitFor(() =>
          expect(onError).toHaveBeenCalledWith(
            expect.objectContaining({
              response: {
                data: failure,
                status: 400,
                statusText: 'Bad Request',
              },
              status: 400,
            }),
          ),
        );
      });
    });
  });

  describe('when a blob is requested', () => {
    it('should return the blob response', async () => {
      const blob = new Blob(['hello'], {
        type: 'text/plain',
      });

      fetch.mockResolvedValue(
        createResponse({
          body: blob,
        }),
      );

      const { result } = renderHook(() =>
        useLazyGet<Blob>({
          responseType: 'blob',
        }),
      );
      const [execute] = result.current;

      await act(async () => {
        await execute('/file');
      });

      const [, results] = result.current;

      await waitFor(() => expect(results.data).toBeInstanceOf(Blob));
      expect(results.error).toBeUndefined();
      expect(results.loading).toBe(false);
    });
  });
});
