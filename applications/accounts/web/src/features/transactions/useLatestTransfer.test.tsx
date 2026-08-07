import { renderHook } from '@testing-library/react';
import { useLatestTransfer } from './useLatestTransfer';

describe('useLatestTransfer', () => {
  it('cancels a superseded transfer and returns only the latest result', async () => {
    const { result } = renderHook(() => useLatestTransfer());
    let firstSignal: AbortSignal | undefined;
    const firstTransfer = result.current(
      (signal) =>
        new Promise<string>((_resolve, reject) => {
          firstSignal = signal;
          signal.addEventListener('abort', () => {
            reject(new DOMException('Superseded', 'AbortError'));
          });
        }),
    );
    const latestTransfer = result.current(() => Promise.resolve('latest'));

    await expect(firstTransfer).resolves.toEqual({ status: 'cancelled' });
    await expect(latestTransfer).resolves.toEqual({
      status: 'completed',
      value: 'latest',
    });
    expect(firstSignal?.aborted).toBe(true);
  });

  it('preserves failures from the current transfer', async () => {
    const { result } = renderHook(() => useLatestTransfer());
    const failure = new Error('Transfer failed');

    await expect(result.current(() => Promise.reject(failure))).rejects.toBe(
      failure,
    );
  });

  it('cancels the active transfer on unmount', async () => {
    const { result, unmount } = renderHook(() => useLatestTransfer());
    let signal: AbortSignal | undefined;
    const transfer = result.current(
      (activeSignal) =>
        new Promise<void>((_resolve, reject) => {
          signal = activeSignal;
          activeSignal.addEventListener('abort', () => {
            reject(new DOMException('Unmounted', 'AbortError'));
          });
        }),
    );

    unmount();

    expect(signal?.aborted).toBe(true);
    await expect(transfer).resolves.toEqual({ status: 'cancelled' });
  });
});
