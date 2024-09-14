import { deleteFile } from '@motech-development/s3-file-operations';
import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { Handler } from 'aws-lambda';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profilesSampleRate: 1.0,
  tracesSampleRate: 1.0,
});

export interface IEvent {
  from: string;
  key: string;
}

export const handler: Handler<IEvent> = wrapHandler(async (event) => {
  const { from, key } = event;

  await deleteFile(from, key);
});
