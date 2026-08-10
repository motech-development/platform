import { PageHeader } from '@motech-development/breeze-ui';
import type { ReactNode } from 'react';

export function EntityCollectionPage({
  action,
  children,
  description,
  refreshState,
  state,
  title,
}: Readonly<{
  action: ReactNode;
  children: ReactNode;
  description: string;
  refreshState?: ReactNode;
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
      {refreshState}
      {children}
    </div>
  );
}
