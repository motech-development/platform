import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import type { DynamoDBRecord } from 'aws-lambda';
import { insert } from '../shared/balance';
import { ITransaction, TransactionStatus } from '../shared/transaction';
import { unmarshallNewRecords } from '../shared/unmarshall-records';

const insertTransactions = (
  documentClient: DynamoDBClient,
  tableName: string,
  records: DynamoDBRecord[],
): (() => Promise<void>)[] => {
  const unmarshalledRecords = unmarshallNewRecords<ITransaction>(
    records,
    'Transaction',
  );

  return unmarshalledRecords
    .filter(({ NewImage }) => NewImage.status === TransactionStatus.Confirmed)
    .map(
      ({ eventID, NewImage }) =>
        () =>
          insert(documentClient, tableName, NewImage, eventID),
    );
};

export default insertTransactions;
