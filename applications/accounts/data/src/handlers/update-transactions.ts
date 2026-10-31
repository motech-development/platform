import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { TransactWriteCommandOutput } from '@aws-sdk/lib-dynamodb';
import type { DynamoDBRecord } from 'aws-lambda';
import { update } from '../shared/balance';
import { ITransaction, TransactionStatus } from '../shared/transaction';
import { unmarshallAllRecords } from '../shared/unmarshall-records';

const updateTransactions = (
  documentClient: DynamoDBClient,
  tableName: string,
  records: DynamoDBRecord[],
): Promise<TransactWriteCommandOutput | undefined>[] => {
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
    .map(({ NewImage, OldImage, eventID, eventSourceARN }) =>
      update(
        documentClient,
        tableName,
        { eventID, eventSourceARN },
        OldImage,
        NewImage,
      ),
    );
};

export default updateTransactions;
