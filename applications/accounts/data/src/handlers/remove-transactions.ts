import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import type { DynamoDBRecord } from 'aws-lambda';
import { remove } from '../shared/balance';
import { ITransaction, TransactionStatus } from '../shared/transaction';
import { unmarshallOldRecords } from '../shared/unmarshall-records';

const removeTransactions = (
  documentClient: DynamoDBClient,
  tableName: string,
  records: DynamoDBRecord[],
): (() => Promise<void>)[] => {
  const unmarshalledRecords = unmarshallOldRecords<ITransaction>(
    records,
    'Transaction',
  );

  return unmarshalledRecords
    .filter(({ OldImage }) => OldImage.status === TransactionStatus.Confirmed)
    .map(
      ({ eventID, OldImage }) =>
        () =>
          remove(documentClient, tableName, OldImage, eventID),
    );
};

export default removeTransactions;
