import { join } from 'node:path';
import {
  SendMessageBatchCommand,
  SendMessageBatchCommandOutput,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { DynamoDBRecord } from 'aws-lambda';
import { ITransaction } from '../shared/transaction';
import { unmarshallOldRecords } from '../shared/unmarshall-records';

const deleteAttachments = (
  sqs: SQSClient,
  queueUrl: string,
  records: DynamoDBRecord[],
): Promise<SendMessageBatchCommandOutput | void> => {
  const unmarshalledRecords = unmarshallOldRecords<ITransaction>(
    records,
    'Transaction',
  );
  const entries = unmarshalledRecords
    .filter(({ OldImage }) => !!OldImage.attachment)
    .map(({ OldImage }) => ({
      DelaySeconds: 300,
      Id: OldImage.id,
      MessageAttributes: {
        key: {
          DataType: 'String',
          StringValue: join(OldImage.owner, OldImage.attachment),
        },
      },
      MessageBody: `Delete ${OldImage.attachment}`,
    }));

  if (entries.length > 0) {
    const command = new SendMessageBatchCommand({
      Entries: entries,
      QueueUrl: queueUrl,
    });

    return sqs.send(command);
  }

  return Promise.resolve();
};

export default deleteAttachments;
