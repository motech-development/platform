import * as Sentry from '@sentry/tanstackstart-react';
import { StartClient } from '@tanstack/react-start/client';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { readAccountsWebConfig } from './config';
import { initialiseObservability } from './observability';

initialiseObservability(readAccountsWebConfig());

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <StartClient />
    </StrictMode>,
    {
      // TanStack's RouteError reports boundary-handled failures with route context.
      onRecoverableError: Sentry.reactErrorHandler(),
      onUncaughtError: Sentry.reactErrorHandler(),
    },
  );
});
