import { Button, PageHeader, StatePanel } from '@motech-development/breeze-ui';
import { WarningIcon } from '@motech-development/breeze-ui/icons';
import type { ReactNode } from 'react';
import { QueryRefreshAlert } from './QueryRefreshAlert';

export function EntityCollectionPage({
  action,
  children,
  description,
  queryState,
  state,
  title,
}: Readonly<{
  action: ReactNode;
  children: ReactNode;
  description: string;
  queryState: {
    errorDescription: string;
    errorTitle: string;
    onRetry: () => void;
    refreshErrorDescription?: string;
    retryLabel: string;
  };
  state: 'empty' | 'error' | 'loading' | 'populated';
  title: string;
}>) {
  return (
    <div className="min-w-0">
      <PageHeader
        actions={state === 'populated' ? action : undefined}
        description={description}
        title={title}
      />
      {queryState.refreshErrorDescription ? (
        <QueryRefreshAlert
          onRetry={queryState.onRetry}
          retryLabel={queryState.retryLabel}
        >
          {queryState.refreshErrorDescription}
        </QueryRefreshAlert>
      ) : null}
      {state === 'error' ? (
        <StatePanel
          action={
            <Button onAction={queryState.onRetry}>
              {queryState.retryLabel}
            </Button>
          }
          description={queryState.errorDescription}
          icon={<WarningIcon />}
          title={queryState.errorTitle}
          variant="danger"
        />
      ) : (
        children
      )}
    </div>
  );
}
