import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { NativeAttributeValue, unmarshall } from '@aws-sdk/util-dynamodb';
import type { DynamoDBRecord, StreamRecord } from 'aws-lambda';
import { insert, remove, update } from './balance';
import { ITransaction, TransactionStatus } from './transaction';

const readTransaction = (
  image: StreamRecord['NewImage'],
): ITransaction | undefined => {
  if (!image) return undefined;

  const item = unmarshall(
    image as Record<string, NativeAttributeValue>,
  ) as ITransaction;

  const { __typename: typename } = item;

  return typename === 'Transaction' ? item : undefined;
};

const applyBalance = async (
  documentClient: DynamoDBClient,
  tableName: string,
  { dynamodb, eventID, eventName }: DynamoDBRecord,
): Promise<string | undefined> => {
  const eventId = eventID as string;
  const previous = readTransaction(dynamodb?.OldImage);
  const current = readTransaction(dynamodb?.NewImage);

  if (
    eventName === 'INSERT' &&
    current?.status === TransactionStatus.Confirmed
  ) {
    await insert(documentClient, tableName, current, eventId);

    return current.companyId;
  }

  if (
    eventName === 'MODIFY' &&
    previous &&
    current &&
    !(
      previous.status === TransactionStatus.Pending &&
      current.status === TransactionStatus.Pending
    )
  ) {
    await update(documentClient, tableName, previous, current, eventId);

    return current.companyId;
  }

  if (
    eventName === 'REMOVE' &&
    previous?.status === TransactionStatus.Confirmed
  ) {
    await remove(documentClient, tableName, previous, eventId);

    return previous.companyId;
  }

  return undefined;
};

export default applyBalance;
