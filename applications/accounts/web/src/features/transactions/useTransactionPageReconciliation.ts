import { NetworkStatus } from '@apollo/client';
import { useEffect, useRef } from 'react';

interface TransactionPageState {
  readonly nextToken?: string | null;
  readonly transactionLoadedPageCount?: number;
  readonly transactionRefreshGeneration?: number;
  readonly transactionRequestedPageCount?: number;
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
  const reconciliationAttempts = useRef({
    generation: refreshGeneration,
    tokens: new Set<string>(),
  });

  useEffect(() => {
    if (
      !nextToken ||
      loadedPageCount >= requestedPageCount ||
      networkStatus === NetworkStatus.fetchMore
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
    fetchMore({ variables: { nextToken } }).catch(() => undefined);
  }, [
    fetchMore,
    loadedPageCount,
    networkStatus,
    nextToken,
    refreshGeneration,
    requestedPageCount,
  ]);
}
