import { DynamoDBRecord } from 'aws-lambda';
import { SQS } from 'aws-sdk';
import { join } from 'path';
import { unmarshallOldRecords } from '../shared/unmarshall-records';

const deleteAttachments = (
  sqs: SQS,
  queueUrl: string,
  records: DynamoDBRecord[],
) => {
  const unmarshalledRecords = unmarshallOldRecords(records, 'Transaction');
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
