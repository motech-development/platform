import { DynamoDBRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { remove, TBalance } from '../shared/balance';
import { ITransaction, TransactionStatus } from '../shared/transaction';
import { unmarshallOldRecords } from '../shared/unmarshall-records';

const removeTransactions = (
  documentClient: DocumentClient,
  tableName: string,
  records: DynamoDBRecord[],
): Promise<TBalance>[] => {
  const unmarshalledRecords = unmarshallOldRecords<ITransaction>(
    records,
    'Transaction',
  );

  return unmarshalledRecords
    .filter(({ OldImage }) => OldImage.status === TransactionStatus.Confirmed)
    .map(({ OldImage }) => remove(documentClient, tableName, OldImage));
};

export default removeTransactions;
