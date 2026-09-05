import { cleanupExpiredStagedFiles } from '@motech-development/s3-file-operations';
import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profileLifecycle: 'trace',
  profileSessionSampleRate: 1,
  tracesSampleRate: 1,
});

export const handler = wrapHandler(async () => {
  await cleanupExpiredStagedFiles();
});
