import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { TransactWriteCommandOutput } from '@aws-sdk/lib-dynamodb';
import type { DynamoDBRecord } from 'aws-lambda';
import { remove } from '../shared/balance';
import { ITransaction, TransactionStatus } from '../shared/transaction';
import { unmarshallOldRecords } from '../shared/unmarshall-records';

const removeTransactions = (
  documentClient: DynamoDBClient,
  tableName: string,
  records: DynamoDBRecord[],
): Promise<TransactWriteCommandOutput | undefined>[] => {
  const unmarshalledRecords = unmarshallOldRecords<ITransaction>(
    records,
    'Transaction',
  );

  return unmarshalledRecords
    .filter(({ OldImage }) => OldImage.status === TransactionStatus.Confirmed)
    .map(({ OldImage, eventID, eventSourceARN }) =>
      remove(documentClient, tableName, { eventID, eventSourceARN }, OldImage),
    );
};

export default removeTransactions;
