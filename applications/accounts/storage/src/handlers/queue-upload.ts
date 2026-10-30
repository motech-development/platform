import { SendMessageBatchCommand, SQSClient } from '@aws-sdk/client-sqs';
import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type { S3Handler } from 'aws-lambda';

const maxEntriesPerBatch = 10;
const maxAttempts = 3;
const baseDelayMs = 50;

const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const sendBatch = async (
  client: SQSClient,
  entries: NonNullable<
    ConstructorParameters<typeof SendMessageBatchCommand>[0]['Entries']
  >,
  queueUrl: string,
): Promise<void> => {
  const sendFailedEntries = async (
    pending: typeof entries,
    attempt: number,
  ): Promise<void> => {
    if (pending.length === 0) return;

    const { Failed = [] } = await client.send(
      new SendMessageBatchCommand({
        Entries: pending,
        QueueUrl: queueUrl,
      }),
    );

    if (Failed.length === 0) return;

    const failures = new Map(Failed.map((failure) => [failure.Id, failure]));
    const failedEntries = pending.filter((entry) => failures.has(entry.Id));

    if (
      failedEntries.length !== Failed.length ||
      Failed.some((failure) => !failure.Id || !failures.has(failure.Id))
    ) {
      throw new Error('SQS returned an invalid batch failure response');
    }

    const senderFault = Failed.find((failure) => failure.SenderFault);

    if (senderFault) {
      throw new Error(
        `SQS rejected entry ${senderFault.Id}: ${senderFault.Code ?? 'sender fault'}`,
      );
    }

    if (attempt + 1 >= maxAttempts) {
      throw new Error(
        `SQS batch send failed after ${maxAttempts} attempts: ${Failed.map(({ Id, Code }) => `${Id}:${Code ?? 'unknown'}`).join(', ')}`,
      );
    }

    await delay(baseDelayMs * 2 ** attempt);
    await sendFailedEntries(failedEntries, attempt + 1);
  };

  return sendFailedEntries(entries, 0);
};

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

  await Promise.all(batches.map((batch) => sendBatch(sqs, batch, QUEUE_URL)));
});
