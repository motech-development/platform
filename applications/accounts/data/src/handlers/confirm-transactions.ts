import { DynamoDBRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import publishNotification from '../shared/publish-notification';
import {
  confirm,
  IScheduledTransaction,
} from '../shared/scheduled-transactions';
import { unmarshallOldRecords } from '../shared/unmarshall-records';

const confirmTransactions = (
  documentClient: DocumentClient,
  tableName: string,
  records: DynamoDBRecord[],
) => {
  const unmarshalledRecords = unmarshallOldRecords<IScheduledTransaction>(
    records,
    'ScheduledTransaction',
  );
  const filtered = unmarshalledRecords.filter(
    ({ OldImage }) => OldImage.active,
  );
  const transactionItems = filtered.map(({ OldImage }) =>
    confirm(documentClient, tableName, OldImage),
  );
  const notification = filtered.map(({ OldImage }) =>
    publishNotification(
      documentClient,
      tableName,
      OldImage.owner,
      'TRANSACTION_PUBLISHED',
    ),
  );

  return [...notification, ...transactionItems];
};

export default confirmTransactions;
