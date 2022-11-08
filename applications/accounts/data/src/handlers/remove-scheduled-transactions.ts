import { DynamoDBRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ITransaction } from '../shared/transaction';
import {
  remove,
  TScheduledTransaction,
} from '../shared/scheduled-transactions';
import { unmarshallOldRecords } from '../shared/unmarshall-records';

const removeScheduledTransactions = (
  documentClient: DocumentClient,
  tableName: string,
  records: DynamoDBRecord[],
): Promise<TScheduledTransaction>[] => {
  const unmarshalledRecords = unmarshallOldRecords<ITransaction>(
    records,
    'Transaction',
  );

  return unmarshalledRecords
    .filter(({ OldImage }) => OldImage.scheduled)
    .map(({ OldImage }) => remove(documentClient, tableName, OldImage));
};

export default removeScheduledTransactions;
