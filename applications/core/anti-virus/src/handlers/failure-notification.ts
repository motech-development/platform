import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import {
  getFileData,
  getStagedFile,
  isMissingFile,
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

const sqs = new SQSClient({});

export interface IEvent {
  from: string;
  key: string;
  managed?: boolean;
  to?: string;
}

export const handler: Handler<IEvent> = wrapHandler(async (event) => {
  const { QUEUE_URL } = process.env;

  if (!QUEUE_URL) {
    throw new Error('No queue set');
  }

  const { from, key } = event;
  const data = await getFileData(from, key).catch((error: unknown) => {
    if (isMissingFile(error)) return undefined;
    throw error;
  });
  if (!data) return { from, key };
  const managed =
    event.managed || data.Metadata?.['attachment-lifecycle'] === 'v1';
  if (managed) {
    if (!event.to) throw new Error('No destination bucket set');
    if ((await getStagedFile(event.to, key))?.state !== 'pending')
      return { from, key };
  }
  const Metadata = data.Metadata ? { ...data.Metadata } : undefined;
  if (Metadata) delete Metadata['attachment-lifecycle'];
  const command = new SendMessageCommand({
    ...(Metadata && Metadata.id
      ? {}
      : {
          DelaySeconds: 600,
        }),
    MessageAttributes: {
      ...(Metadata
        ? {
            metadata: {
              DataType: 'String',
              StringValue: JSON.stringify(Metadata),
            },
          }
        : {}),
      key: {
        DataType: 'String',
        StringValue: key,
      },
      source: {
        DataType: 'String',
        StringValue: from,
      },
    },
    MessageBody: `${key} has failed virus scan`,
    QueueUrl: QUEUE_URL,
  });

  await sqs.send(command);

  return {
    from,
    key,
    ...(managed ? { managed, to: event.to } : {}),
  };
});
