import { PageHeader } from '@motech-development/breeze-ui';
import type { ReactNode } from 'react';

export function EntityCollectionPage({
  action,
  children,
  description,
  empty,
  emptyState,
  error,
  errorState,
  loading,
  loadingState,
  refreshState,
  title,
}: Readonly<{
  action: ReactNode;
  children: ReactNode;
  description: string;
  empty: boolean;
  emptyState: ReactNode;
  error: boolean;
  errorState: ReactNode;
  loading: boolean;
  loadingState: ReactNode;
  refreshState?: ReactNode;
  title: string;
}>) {
  const populated = !empty && !error && !loading;

  return (
    <div className="min-w-0">
      <PageHeader
        actions={populated ? action : undefined}
        description={description}
        title={title}
      />
      {refreshState}
      {error ? errorState : null}
      {loading ? loadingState : null}
      {populated ? children : null}
      {empty ? emptyState : null}
    </div>
  );
}
