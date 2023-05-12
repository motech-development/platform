import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UpdateCommandOutput } from '@aws-sdk/lib-dynamodb';
import { DynamoDBRecord } from 'aws-lambda';
import publishNotification from '../shared/publish-notification';
import {
  confirm,
  IScheduledTransaction,
} from '../shared/scheduled-transactions';
import { unmarshallOldRecords } from '../shared/unmarshall-records';

const confirmTransactions = (
  documentClient: DynamoDBClient,
  tableName: string,
  records: DynamoDBRecord[],
): Promise<UpdateCommandOutput>[] => {
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
