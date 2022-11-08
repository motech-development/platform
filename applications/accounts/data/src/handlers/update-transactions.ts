import { DynamoDBRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { TBalance, update } from '../shared/balance';
import { ITransaction, TransactionStatus } from '../shared/transaction';
import { unmarshallAllRecords } from '../shared/unmarshall-records';

const updateTransactions = (
  documentClient: DocumentClient,
  tableName: string,
  records: DynamoDBRecord[],
): Promise<TBalance>[] => {
  const unmarshalledRecords = unmarshallAllRecords<ITransaction>(
    records,
    'Transaction',
  );

  return unmarshalledRecords
    .filter(
      ({ NewImage, OldImage }) =>
        !(
          NewImage.status === TransactionStatus.Pending &&
          OldImage.status === TransactionStatus.Pending
        ),
    )
    .map(({ NewImage, OldImage }) =>
      update(documentClient, tableName, OldImage, NewImage),
    );
};

export default updateTransactions;
