import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UpdateCommandOutput } from '@aws-sdk/lib-dynamodb';
import { DynamoDBRecord } from 'aws-lambda';
import { update } from '../shared/scheduled-transactions';
import { ITransaction } from '../shared/transaction';
import { unmarshallAllRecords } from '../shared/unmarshall-records';

const updateScheduledTransactions = (
  documentClient: DynamoDBClient,
  tableName: string,
  records: DynamoDBRecord[],
): Promise<UpdateCommandOutput | void>[] => {
  const unmarshalledRecords = unmarshallAllRecords<ITransaction>(
    records,
    'Transaction',
  );

  return unmarshalledRecords.map(({ OldImage, NewImage }) =>
    update(documentClient, tableName, OldImage, NewImage),
  );
};

export default updateScheduledTransactions;
