import { DynamoDBRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { insert } from '../shared/balance';
import { ITransaction, TransactionStatus } from '../shared/transaction';
import { unmarshallNewRecords } from '../shared/unmarshall-records';

const insertTransactions = (
  documentClient: DocumentClient,
  tableName: string,
  records: DynamoDBRecord[],
) => {
  const unmarshalledRecords = unmarshallNewRecords<ITransaction>(
    records,
    'Transaction',
  );

  return unmarshalledRecords
    .filter(({ NewImage }) => NewImage.status === TransactionStatus.Confirmed)
    .map(({ NewImage }) => insert(documentClient, tableName, NewImage));
};

export default insertTransactions;
