import { DynamoDBRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { remove } from '../shared/balance';
import { ITransaction, TransactionStatus } from '../shared/transaction';
import { unmarshallOldRecords } from '../shared/unmarshall-records';

const removeTransactions = (
  documentClient: DocumentClient,
  tableName: string,
  records: DynamoDBRecord[],
) => {
  const unmarshalledRecords = unmarshallOldRecords<ITransaction>(
    records,
    'Transaction',
  );
  const transactionItems = unmarshalledRecords
    .filter(({ OldImage }) => OldImage.status === TransactionStatus.Confirmed)
    .map(({ OldImage }) => remove(documentClient, tableName, OldImage));

  return transactionItems;
};

export default removeTransactions;
