import { Alert, Button } from '@motech-development/breeze-ui';
import type { ReactNode } from 'react';

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
    <Alert className="mb-6 flex-wrap" variant="warning">
      <span className="min-w-0 flex-1">{children}</span>
      <Button appearance="text" onAction={onRetry}>
        {retryLabel}
      </Button>
    </Alert>
  );
}
