import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { TransactWriteCommandOutput } from '@aws-sdk/lib-dynamodb';
import type { DynamoDBRecord } from 'aws-lambda';
import { insert } from '../shared/balance';
import { ITransaction, TransactionStatus } from '../shared/transaction';
import { unmarshallNewRecords } from '../shared/unmarshall-records';

const insertTransactions = (
  documentClient: DynamoDBClient,
  tableName: string,
  records: DynamoDBRecord[],
): Promise<TransactWriteCommandOutput | undefined>[] => {
  const unmarshalledRecords = unmarshallNewRecords<ITransaction>(
    records,
    'Transaction',
  );

  return unmarshalledRecords
    .filter(({ NewImage }) => NewImage.status === TransactionStatus.Confirmed)
    .map(({ NewImage, eventID, eventSourceARN }) =>
      insert(documentClient, tableName, { eventID, eventSourceARN }, NewImage),
    );
};

export default insertTransactions;
