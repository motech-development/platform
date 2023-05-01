import { act, renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useGet, useLazyGet, usePost, usePut } from '../axios-hooks';

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

  let onCompleted: jest.Mock;
  let onError: jest.Mock;

  beforeEach(() => {
    onCompleted = jest.fn();
    onError = jest.fn();
  });

  describe('when response is successful', () => {
    beforeEach(() => {
      axios.request = jest.fn().mockResolvedValue({
        data: success,
      });
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
          expect(axios.request).toHaveBeenCalledWith({
            headers: {
              'Content-Type': 'text/html',
            },
            method: 'GET',
            responseType: 'text',
            url: '/get',
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
          expect(axios.request).toHaveBeenCalledWith({
            headers: {
              Authorization: 'bearer fgdskfgsdhjfgj',
              'Content-Type': 'text/html',
            },
            method: 'GET',
            responseType: 'text',
            url: '/get',
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
          expect(axios.request).toHaveBeenCalledWith({
            data: body,
            headers: {
              Authorization: 'bearer fgdskfgsdhjfgj',
              'Content-Type': 'application/json',
            },
            method: 'POST',
            responseType: 'json',
            url: '/post',
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
          expect(axios.request).toHaveBeenCalledWith({
            data: body,
            headers: {
              Authorization: 'bearer fgdskfgsdhjfgj',
              'Content-Type': 'application/json',
            },
            method: 'PUT',
            responseType: 'json',
            url: '/put',
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
    });
  });

  describe('when response is not successful', () => {
    beforeEach(() => {
      axios.request = jest.fn().mockRejectedValue({
        data: failure,
        isAxiosError: true,
      });
    });

    describe('useGet', () => {
      it('should return the correct response', async () => {
        const { result } = renderHook(() => useGet('/get'));

        await waitFor(() =>
          expect(result.current).toEqual({
            data: undefined,
            error: {
              data: failure,
              isAxiosError: true,
            },
            loading: false,
          }),
        );
      });

      it('should call onError callback', async () => {
        renderHook(() =>
          useGet('/get', {
            onError,
          }),
        );

        await waitFor(() =>
          expect(onError).toHaveBeenCalledWith({
            data: failure,
            isAxiosError: true,
          }),
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

        await waitFor(() =>
          expect(results).toEqual({
            data: undefined,
            error: {
              data: failure,
              isAxiosError: true,
            },
            loading: false,
          }),
        );
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
          expect(onError).toHaveBeenCalledWith({
            data: failure,
            isAxiosError: true,
          }),
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

        await waitFor(() =>
          expect(results).toEqual({
            data: undefined,
            error: {
              data: failure,
              isAxiosError: true,
            },
            loading: false,
          }),
        );
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
          expect(onError).toHaveBeenCalledWith({
            data: failure,
            isAxiosError: true,
          }),
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

        await waitFor(() =>
          expect(results).toEqual({
            data: undefined,
            error: {
              data: failure,
              isAxiosError: true,
            },
            loading: false,
          }),
        );
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
          expect(onError).toHaveBeenCalledWith({
            data: failure,
            isAxiosError: true,
          }),
        );
      });
    });
  });
});
