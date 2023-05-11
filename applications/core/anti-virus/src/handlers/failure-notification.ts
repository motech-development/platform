import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { getFileData } from '@motech-development/s3-file-operations';
import { Handler } from 'aws-lambda';

const sqs = new SQSClient({});

export interface IEvent {
  from: string;
  key: string;
}

export const handler: Handler<IEvent> = async (event) => {
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
};
