import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type { DynamoDBStreamHandler } from 'aws-lambda';
import { clearDeletedAttachments } from './attachments';
import { synchroniseSchedules } from './schedule-transactions';
import { updateTypeahead } from './typeahead';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profileLifecycle: 'trace',
  profileSessionSampleRate: 1,
  tracesSampleRate: 1,
});

export const handler: DynamoDBStreamHandler = wrapHandler(async (event) => {
  const results = await Promise.allSettled([
    synchroniseSchedules(event),
    updateTypeahead(event),
    clearDeletedAttachments(event),
  ]);
  const failure = results.find(
    (result): result is PromiseRejectedResult => result.status === 'rejected',
  );

  if (failure) {
    throw failure.reason;
  }
});
