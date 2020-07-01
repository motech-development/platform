import { DynamoDBRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
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
  const transactionItems = unmarshalledRecords
    .filter(({ OldImage }) => OldImage.active)
    .map(({ OldImage }) => confirm(documentClient, tableName, OldImage));

  return transactionItems;
};

export default confirmTransactions;
