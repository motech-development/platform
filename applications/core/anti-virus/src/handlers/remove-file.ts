import {
  deleteFile,
  deleteStagedFile,
} from '@motech-development/s3-file-operations';
import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type { Handler } from 'aws-lambda';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profileLifecycle: 'trace',
  profileSessionSampleRate: 1,
  tracesSampleRate: 1,
});

export interface IEvent {
  from: string;
  key: string;
  managed?: boolean;
  to?: string;
}

export const handler: Handler<IEvent> = wrapHandler(async (event) => {
  const { from, key } = event;

  if (event.managed) {
    if (!event.to) throw new Error('No destination bucket set');
    await deleteStagedFile(from, event.to, decodeURIComponent(key), {
      pendingOnly: true,
    });
  } else await deleteFile(from, key);
});
