import { basename, extname } from 'node:path';
import { SendMessageBatchCommand, SQSClient } from '@aws-sdk/client-sqs';
import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { S3Handler } from 'aws-lambda';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profilesSampleRate: 1.0,
  tracesSampleRate: 1.0,
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

  const entries = event.Records.map((record) => {
    const bucket = record.s3.bucket.name;
    const file = record.s3.object.key;
    const ext = extname(file);
    const id = basename(file, ext);

    return {
      Id: id,
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

  const command = new SendMessageBatchCommand({
    Entries: entries,
    QueueUrl: QUEUE_URL,
  });

  await sqs.send(command);
});
