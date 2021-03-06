import { DynamoDBRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ITransaction } from '../shared/transaction';
import { update } from '../shared/scheduled-transactions';
import { unmarshallAllRecords } from '../shared/unmarshall-records';

const updateScheduledTransactions = (
  documentClient: DocumentClient,
  tableName: string,
  records: DynamoDBRecord[],
) => {
  const unmarshalledRecords = unmarshallAllRecords<ITransaction>(
    records,
    'Transaction',
  );
  const transactionItems = unmarshalledRecords.map(({ OldImage, NewImage }) =>
    update(documentClient, tableName, OldImage, NewImage),
  );

  return transactionItems;
};

export default updateScheduledTransactions;
