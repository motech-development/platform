import { DynamoDBRecord } from 'aws-lambda';
import { AWSError } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';
import { insert } from '../shared/balance';
import { ITransaction, TransactionStatus } from '../shared/transaction';
import { unmarshallNewRecords } from '../shared/unmarshall-records';

export type TInsertTransaction = PromiseResult<
  DocumentClient.UpdateItemOutput,
  AWSError
>;

const insertTransactions = (
  documentClient: DocumentClient,
  tableName: string,
  records: DynamoDBRecord[],
): Promise<TInsertTransaction>[] => {
  const unmarshalledRecords = unmarshallNewRecords<ITransaction>(
    records,
    'Transaction',
  );

  return unmarshalledRecords
    .filter(({ NewImage }) => NewImage.status === TransactionStatus.Confirmed)
    .map(({ NewImage }) => insert(documentClient, tableName, NewImage));
};

export default insertTransactions;
