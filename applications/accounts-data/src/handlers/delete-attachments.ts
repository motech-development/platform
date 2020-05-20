import { DynamoDBRecord } from 'aws-lambda';
import { SQS } from 'aws-sdk';
import { unmarshallOldRecords } from '../shared/unmarshall-records';

const deleteAttachments = (
  sqs: SQS,
  queueUrl: string,
  records: DynamoDBRecord[],
) => {
  const unmarshalledRecords = unmarshallOldRecords(records, 'Transaction');
  const entries = unmarshalledRecords.map(({ OldImage }) => ({
    Id: OldImage.id,
    MessageAttributes: {
      key: {
        DataType: 'String',
        StringValue: OldImage.attachment,
      },
    },
    MessageBody: `Delete ${OldImage.attachment}`,
  }));

  return sqs
    .sendMessageBatch({
      Entries: entries,
      QueueUrl: queueUrl,
    })
    .promise();
};

export default deleteAttachments;
