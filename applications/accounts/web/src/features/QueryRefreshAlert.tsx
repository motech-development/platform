import type { ReactNode } from 'react';
import { RetryAlert } from './RetryAlert';

export function QueryRefreshAlert({
  children,
  onRetry,
  retryLabel,
}: Readonly<{
  children: ReactNode;
  onRetry: () => void;
  retryLabel: string;
}>) {
  return (
    <RetryAlert
      className="mb-6 flex-wrap"
      onRetry={onRetry}
      retryLabel={retryLabel}
    >
      {children}
    </RetryAlert>
  );
}
