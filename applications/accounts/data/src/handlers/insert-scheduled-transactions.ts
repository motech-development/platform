import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UpdateCommandOutput } from '@aws-sdk/lib-dynamodb';
import { DynamoDBRecord } from 'aws-lambda';
import { ITransaction } from '../shared/transaction';
import { insert } from '../shared/scheduled-transactions';
import { unmarshallNewRecords } from '../shared/unmarshall-records';

const insertScheduledTransactions = (
  documentClient: DynamoDBClient,
  tableName: string,
  records: DynamoDBRecord[],
): Promise<UpdateCommandOutput>[] => {
  const unmarshalledRecords = unmarshallNewRecords<ITransaction>(
    records,
    'Transaction',
  );

  return unmarshalledRecords
    .filter(({ NewImage }) => NewImage.scheduled)
    .map(({ NewImage }) => insert(documentClient, tableName, NewImage));
};

export default insertScheduledTransactions;
