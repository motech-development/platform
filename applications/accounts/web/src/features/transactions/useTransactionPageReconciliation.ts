import { NetworkStatus } from '@apollo/client';
import { useCallback, useEffect, useRef, useState } from 'react';

interface TransactionPageState {
  readonly nextToken?: string | null;
  readonly transactionLoadedPageCount?: number;
  readonly transactionRefreshGeneration?: number;
  readonly transactionRequestedPageCount?: number;
}

interface PaginationFailure {
  readonly generation: number;
  readonly token: string;
}

export function useTransactionPageReconciliation({
  fetchMore,
  networkStatus,
  page,
}: Readonly<{
  fetchMore: (options: {
    variables: { nextToken: string };
  }) => Promise<unknown>;
  networkStatus: NetworkStatus;
  page?: TransactionPageState;
}>) {
  const loadedPageCount = page?.transactionLoadedPageCount ?? 1;
  const requestedPageCount = page?.transactionRequestedPageCount ?? 1;
  const refreshGeneration = page?.transactionRefreshGeneration ?? 0;
  const nextToken = page?.nextToken;
  const [failure, setFailure] = useState<PaginationFailure>();
  const reconciliationAttempts = useRef({
    generation: refreshGeneration,
    tokens: new Set<string>(),
  });
  const currentFailure =
    failure?.generation === refreshGeneration ? failure : undefined;
  const requestPage = useCallback(
    async (token: string, generation: number) => {
      try {
        await fetchMore({ variables: { nextToken: token } });
        setFailure((current) =>
          current?.generation === generation && current.token === token
            ? undefined
            : current,
        );
      } catch {
        setFailure({ generation, token });
      }
    },
    [fetchMore],
  );
  const loadNextPage = useCallback(
    () =>
      nextToken ? requestPage(nextToken, refreshGeneration) : Promise.resolve(),
    [nextToken, refreshGeneration, requestPage],
  );
  const retry = useCallback(
    () =>
      currentFailure
        ? requestPage(currentFailure.token, refreshGeneration)
        : Promise.resolve(),
    [currentFailure, refreshGeneration, requestPage],
  );

  useEffect(() => {
    if (
      !nextToken ||
      loadedPageCount >= requestedPageCount ||
      networkStatus === NetworkStatus.fetchMore ||
      currentFailure
    ) {
      return;
    }

    if (reconciliationAttempts.current.generation !== refreshGeneration) {
      reconciliationAttempts.current = {
        generation: refreshGeneration,
        tokens: new Set<string>(),
      };
    }

    const attempts = reconciliationAttempts.current.tokens;

    if (attempts.has(nextToken)) return;
    attempts.add(nextToken);
    requestPage(nextToken, refreshGeneration).catch(() => undefined);
  }, [
    currentFailure,
    loadedPageCount,
    networkStatus,
    nextToken,
    requestPage,
    refreshGeneration,
    requestedPageCount,
  ]);

  return {
    failed: Boolean(currentFailure),
    loadNextPage,
    loading: networkStatus === NetworkStatus.fetchMore,
    nextToken,
    retry,
  };
}
