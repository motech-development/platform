import { deleteStagedFile } from '@motech-development/s3-file-operations';
import { captureException, init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type { SQSHandler } from 'aws-lambda';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profileLifecycle: 'trace',
  profileSessionSampleRate: 1,
  tracesSampleRate: 1,
});

export const handler: SQSHandler = wrapHandler(async (event) => {
  const { DOWNLOAD_BUCKET, UPLOAD_BUCKET } = process.env;

  if (!DOWNLOAD_BUCKET) {
    throw new Error('No destination bucket set');
  }

  if (!UPLOAD_BUCKET) throw new Error('No upload bucket set');

  const results = await Promise.allSettled(
    event.Records.map(async ({ messageAttributes }) => {
      const { key } = messageAttributes;

      if (key && key.stringValue) {
        await deleteStagedFile(UPLOAD_BUCKET, DOWNLOAD_BUCKET, key.stringValue);
      }
    }),
  );

  return {
    batchItemFailures: results.flatMap((result, index) => {
      if (result.status === 'fulfilled') return [];

      captureException(result.reason);

      return [
        {
          itemIdentifier: event.Records[index].messageId,
        },
      ];
    }),
  };
});
