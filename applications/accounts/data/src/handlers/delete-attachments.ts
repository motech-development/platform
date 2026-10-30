import { join } from 'node:path';
import type { SQSClient } from '@aws-sdk/client-sqs';
import sendSqsBatchWithRetry from '@motech-development/sqs-batch-publisher';
import type { DynamoDBRecord } from 'aws-lambda';
import { ITransaction } from '../shared/transaction';
import { unmarshallOldRecords } from '../shared/unmarshall-records';

const maxEntriesPerBatch = 10;

const deleteAttachments = (
  sqs: SQSClient,
  queueUrl: string,
  records: DynamoDBRecord[],
): Promise<void> => {
  const unmarshalledRecords = unmarshallOldRecords<ITransaction>(
    records,
    'Transaction',
  );
  const entries = unmarshalledRecords
    .filter(({ OldImage }) => !!OldImage.attachment)
    .map(({ OldImage }, index) => ({
      DelaySeconds: 300,
      Id: `message-${index}`,
      MessageAttributes: {
        key: {
          DataType: 'String',
          StringValue: join(OldImage.owner, OldImage.attachment),
        },
      },
      MessageBody: `Delete ${OldImage.attachment}`,
    }));

  const batches = [];

  for (let start = 0; start < entries.length; start += maxEntriesPerBatch) {
    batches.push(entries.slice(start, start + maxEntriesPerBatch));
  }

  return batches.reduce<Promise<void>>(
    (previous, batch) =>
      previous.then(() => sendSqsBatchWithRetry(sqs, queueUrl, batch)),
    Promise.resolve(),
  );
};

export default deleteAttachments;
