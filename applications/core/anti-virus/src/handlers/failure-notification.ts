import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { getFileData } from '@motech-development/s3-file-operations';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { AWSLambda } from '@sentry/serverless';
import { Handler } from 'aws-lambda';

AWSLambda.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new ProfilingIntegration()],
  profilesSampleRate: 1.0,
  tracesSampleRate: 1.0,
});

const sqs = new SQSClient({});

export interface IEvent {
  from: string;
  key: string;
}

export const handler: Handler<IEvent> = AWSLambda.wrapHandler(async (event) => {
  const { QUEUE_URL } = process.env;

  if (!QUEUE_URL) {
    throw new Error('No queue set');
  }

  const { from, key } = event;
  const { Metadata } = await getFileData(from, key);
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
  };
});
