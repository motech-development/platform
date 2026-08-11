import { Button, PageHeader, StatePanel } from '@motech-development/breeze-ui';
import { WarningIcon } from '@motech-development/breeze-ui/icons';
import type { ReactNode } from 'react';
import { QueryRefreshAlert } from './QueryRefreshAlert';

type CollectionState = 'empty' | 'error' | 'loading' | 'populated';

function collectionState({
  empty,
  error,
  hasData,
  loading,
}: Readonly<{
  empty: boolean;
  error: unknown;
  hasData: boolean;
  loading: boolean;
}>): CollectionState {
  if (error && !hasData) return 'error';
  if (loading && !hasData) return 'loading';
  if (empty) return 'empty';

  return 'populated';
}

export function EntityCollectionPage({
  action,
  children,
  description,
  empty,
  emptyState,
  hasData,
  loading,
  loadingState,
  queryState,
  title,
}: Readonly<{
  action: ReactNode;
  children: ReactNode;
  description: string;
  empty: boolean;
  emptyState: ReactNode;
  hasData: boolean;
  loading: boolean;
  loadingState: ReactNode;
  queryState: {
    error: unknown;
    errorDescription: string;
    errorTitle: string;
    onRetry: () => void;
    refreshErrorDescription: string;
    retryLabel: string;
  };
  title: string;
}>) {
  const refreshError = Boolean(queryState.error && hasData);
  const state = collectionState({
    empty,
    error: queryState.error,
    hasData,
    loading,
  });
  let content = children;

  if (state === 'loading') content = loadingState;
  if (state === 'empty') content = emptyState;
  if (state === 'error') {
    content = (
      <StatePanel
        action={
          <Button onAction={queryState.onRetry}>{queryState.retryLabel}</Button>
        }
        description={queryState.errorDescription}
        icon={<WarningIcon />}
        title={queryState.errorTitle}
        variant="danger"
      />
    );
  }

  return (
    <div className="min-w-0">
      <PageHeader
        actions={state === 'populated' ? action : undefined}
        description={description}
        title={title}
      />
      {refreshError ? (
        <QueryRefreshAlert
          onRetry={queryState.onRetry}
          retryLabel={queryState.retryLabel}
        >
          {queryState.refreshErrorDescription}
        </QueryRefreshAlert>
      ) : null}
      {content}
    </div>
  );
}
