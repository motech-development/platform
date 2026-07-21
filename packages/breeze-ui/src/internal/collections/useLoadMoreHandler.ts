import { useCallback, useEffect, useRef } from 'react';

interface LoadMoreHandlerOptions {
  loading: boolean;
  onLoadMore: () => void | Promise<void>;
}

export default function useLoadMoreHandler({
  loading,
  onLoadMore,
}: LoadMoreHandlerOptions): () => void {
  const activeRequestRef = useRef(false);
  const loadingRef = useRef(loading);

  useEffect(() => {
    loadingRef.current = loading;

    if (!loading) {
      activeRequestRef.current = false;
    }
  }, [loading]);

  return useCallback(() => {
    if (loadingRef.current || activeRequestRef.current) {
      return;
    }

    activeRequestRef.current = true;

    const result = onLoadMore();

    if (result instanceof Promise) {
      const clearActiveRequest = () => {
        if (!loadingRef.current) {
          activeRequestRef.current = false;
        }
      };

      result.then(clearActiveRequest, clearActiveRequest);

      return;
    }

    queueMicrotask(() => {
      if (!loadingRef.current) {
        activeRequestRef.current = false;
      }
    });
  }, [onLoadMore]);
}
