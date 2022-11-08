import { DynamoDBRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { AWSError } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { ITransaction } from '../shared/transaction';
import { insert } from '../shared/scheduled-transactions';
import { unmarshallNewRecords } from '../shared/unmarshall-records';

export type TInsertScheduledTransactions = PromiseResult<
  DocumentClient.UpdateItemOutput,
  AWSError
>;

const insertScheduledTransactions = (
  documentClient: DocumentClient,
  tableName: string,
  records: DynamoDBRecord[],
): Promise<TInsertScheduledTransactions>[] => {
  const unmarshalledRecords = unmarshallNewRecords<ITransaction>(
    records,
    'Transaction',
  );

  return unmarshalledRecords
    .filter(({ NewImage }) => NewImage.scheduled)
    .map(({ NewImage }) => insert(documentClient, tableName, NewImage));
};

export default insertScheduledTransactions;
