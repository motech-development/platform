import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UpdateCommandOutput } from '@aws-sdk/lib-dynamodb';
import { DynamoDBRecord } from 'aws-lambda';
import { remove } from '../shared/balance';
import { ITransaction, TransactionStatus } from '../shared/transaction';
import { unmarshallOldRecords } from '../shared/unmarshall-records';

const removeTransactions = (
  documentClient: DynamoDBClient,
  tableName: string,
  records: DynamoDBRecord[],
): Promise<UpdateCommandOutput>[] => {
  const unmarshalledRecords = unmarshallOldRecords<ITransaction>(
    records,
    'Transaction',
  );

  return unmarshalledRecords
    .filter(({ OldImage }) => OldImage.status === TransactionStatus.Confirmed)
    .map(({ OldImage }) => remove(documentClient, tableName, OldImage));
};

export default removeTransactions;
