import { useEffect, useRef } from 'react';

type LatestTransferResult<Result> =
  | Readonly<{ status: 'cancelled' }>
  | Readonly<{ status: 'completed'; value: Result }>;

export function useLatestTransfer() {
  const activeController = useRef<AbortController | undefined>(undefined);

  useEffect(
    () => () => {
      activeController.current?.abort();
    },
    [],
  );

  return async function runLatestTransfer<Result>(
    transfer: (signal: AbortSignal) => Promise<Result>,
  ): Promise<LatestTransferResult<Result>> {
    activeController.current?.abort();
    const controller = new AbortController();

    activeController.current = controller;

    try {
      const value = await transfer(controller.signal);

      if (
        controller.signal.aborted ||
        activeController.current !== controller
      ) {
        return { status: 'cancelled' };
      }

      return { status: 'completed', value };
    } catch (cause: unknown) {
      if (
        controller.signal.aborted ||
        activeController.current !== controller
      ) {
        return { status: 'cancelled' };
      }

      throw cause;
    } finally {
      if (activeController.current === controller) {
        activeController.current = undefined;
      }
    }
  };
}
