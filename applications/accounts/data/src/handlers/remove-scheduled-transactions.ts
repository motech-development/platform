import { DynamoDBRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ITransaction } from '../shared/transaction';
import { remove } from '../shared/scheduled-transactions';
import { unmarshallOldRecords } from '../shared/unmarshall-records';

const removeScheduledTransactions = (
  documentClient: DocumentClient,
  tableName: string,
  records: DynamoDBRecord[],
) => {
  const unmarshalledRecords = unmarshallOldRecords<ITransaction>(
    records,
    'Transaction',
  );
  const transactionItems = unmarshalledRecords
    .filter(({ OldImage }) => OldImage.scheduled)
    .map(({ OldImage }) => remove(documentClient, tableName, OldImage));

  return transactionItems;
};

export default removeScheduledTransactions;
