import { SendMessageBatchCommand, SQSClient } from '@aws-sdk/client-sqs';
import { S3Handler } from 'aws-lambda';
import { basename, extname } from 'path';

const sqs = new SQSClient({});

export const handler: S3Handler = async (event) => {
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
};
