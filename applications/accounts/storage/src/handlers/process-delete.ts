import { deleteFile } from '@motech-development/s3-file-operations';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { AWSLambda } from '@sentry/serverless';
import { SQSHandler } from 'aws-lambda';

AWSLambda.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new ProfilingIntegration()],
  profilesSampleRate: 1.0,
  tracesSampleRate: 1.0,
});

export const handler: SQSHandler = AWSLambda.wrapHandler(async (event) => {
  const { DOWNLOAD_BUCKET } = process.env;

  if (!DOWNLOAD_BUCKET) {
    throw new Error('No destination bucket set');
  }

  const deletions = event.Records.map((record) => {
    const { messageAttributes } = record;
    const { key } = messageAttributes;

    if (key && key.stringValue) {
      return deleteFile(DOWNLOAD_BUCKET, key.stringValue);
    }

    return null;
  });

  await Promise.all(deletions);
});
