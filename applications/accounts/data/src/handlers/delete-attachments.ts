import { join } from 'node:path';
import { SendMessageBatchCommand, SQSClient } from '@aws-sdk/client-sqs';
import type { DynamoDBRecord } from 'aws-lambda';
import { ITransaction } from '../shared/transaction';
import { unmarshallOldRecords } from '../shared/unmarshall-records';

const deleteAttachments = async (
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

    const { Failed } = await sqs.send(command);

    if (Failed && Failed.length > 0) {
      throw new Error(`Failed to queue ${Failed.length} attachment deletions`);
    }
  }
};

export default deleteAttachments;
