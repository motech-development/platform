import {
  moveFile,
  moveStagedFile,
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
  to: string;
}

export const handler: Handler<IEvent> = wrapHandler(async (event) => {
  const { from, key, to } = event;

  if (event.managed) await moveStagedFile(from, to, key);
  else await moveFile(from, to, key);
});
