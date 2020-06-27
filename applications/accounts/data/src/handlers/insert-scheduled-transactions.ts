import { DynamoDBRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ITransaction } from '../shared/transaction';
import { insert } from '../shared/scheduled-transactions';
import { unmarshallNewRecords } from '../shared/unmarshall-records';

const insertScheduledTransactions = (
  documentClient: DocumentClient,
  tableName: string,
  records: DynamoDBRecord[],
) => {
  const unmarshalledRecords = unmarshallNewRecords<ITransaction>(
    records,
    'Transaction',
  );
  const transactionItems = unmarshalledRecords
    .filter(({ NewImage }) => NewImage.scheduled)
    .map(({ NewImage }) => insert(documentClient, tableName, NewImage));

  return transactionItems;
};

export default insertScheduledTransactions;
