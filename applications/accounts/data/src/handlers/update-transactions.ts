import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import type { DynamoDBRecord } from 'aws-lambda';
import { update } from '../shared/balance';
import { ITransaction, TransactionStatus } from '../shared/transaction';
import { unmarshallAllRecords } from '../shared/unmarshall-records';

const updateTransactions = (
  documentClient: DynamoDBClient,
  tableName: string,
  records: DynamoDBRecord[],
): (() => Promise<void>)[] => {
  const unmarshalledRecords = unmarshallAllRecords<ITransaction>(
    records,
    'Transaction',
  );

  return unmarshalledRecords
    .filter(
      ({ NewImage, OldImage }) =>
        !(
          NewImage.status === TransactionStatus.Pending &&
          OldImage.status === TransactionStatus.Pending
        ),
    )
    .map(
      ({ eventID, NewImage, OldImage }) =>
        () =>
          update(documentClient, tableName, OldImage, NewImage, eventID),
    );
};

export default updateTransactions;
