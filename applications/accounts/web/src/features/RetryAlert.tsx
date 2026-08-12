import { Alert, Button } from '@motech-development/breeze-ui';
import type { ReactNode } from 'react';

export function RetryAlert({
  children,
  className,
  loading = false,
  onRetry,
  retryLabel,
  variant = 'warning',
}: Readonly<{
  children: ReactNode;
  className: string;
  loading?: boolean;
  onRetry: () => void;
  retryLabel: string;
  variant?: 'danger' | 'warning';
}>) {
  return (
    <Alert className={className} variant={variant}>
      <span className="min-w-0 flex-1">{children}</span>
      <Button appearance="text" loading={loading} onAction={onRetry}>
        {retryLabel}
      </Button>
    </Alert>
  );
}
