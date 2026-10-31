import { SQSClient } from '@aws-sdk/client-sqs';
import sendSqsBatchWithRetry from '@motech-development/sqs-batch-publisher';
import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type { S3Handler } from 'aws-lambda';

const maxEntriesPerBatch = 10;

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profileLifecycle: 'trace',
  profileSessionSampleRate: 1,
  tracesSampleRate: 1,
});

const sqs = new SQSClient({});

export const handler: S3Handler = wrapHandler(async (event) => {
  const { DOWNLOAD_BUCKET, QUEUE_URL } = process.env;

  if (!QUEUE_URL) {
    throw new Error('No queue set');
  }

  if (!DOWNLOAD_BUCKET) {
    throw new Error('No destination bucket set');
  }

  const entries = event.Records.map((record, index) => {
    const bucket = record.s3.bucket.name;
    const file = record.s3.object.key;

    return {
      Id: `message-${index}`,
      MessageAttributes: {
        from: {
          DataType: 'String',
          StringValue: bucket,
        },
        key: {
          DataType: 'String',
          StringValue: file,
        },
        to: {
          DataType: 'String',
          StringValue: DOWNLOAD_BUCKET,
        },
      },
      MessageBody: `Upload ${file}`,
    };
  });

  const batches = [];

  for (let start = 0; start < entries.length; start += maxEntriesPerBatch) {
    batches.push(entries.slice(start, start + maxEntriesPerBatch));
  }

  await Promise.all(
    batches.map((batch) => sendSqsBatchWithRetry(sqs, QUEUE_URL, batch)),
  );
});
