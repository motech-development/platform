import { DynamoDBRecord } from 'aws-lambda';
import { AWSError, SQS } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { join } from 'path';
import { ITransaction } from '../shared/transaction';
import { unmarshallOldRecords } from '../shared/unmarshall-records';

export type TDeleteAttachments = PromiseResult<
  SQS.SendMessageBatchResult,
  AWSError
> | void;

const deleteAttachments = (
  sqs: SQS,
  queueUrl: string,
  records: DynamoDBRecord[],
): Promise<TDeleteAttachments> => {
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
    return sqs
      .sendMessageBatch({
        Entries: entries,
        QueueUrl: queueUrl,
      })
      .promise();
  }

  return Promise.resolve();
};

export default deleteAttachments;
