import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { NativeAttributeValue, unmarshall } from '@aws-sdk/util-dynamodb';
import type { DynamoDBRecord, StreamRecord } from 'aws-lambda';
import { insert, move, remove, update } from './balance';
import { ITransaction, TransactionStatus } from './transaction';
import transactionCompanyId from './transaction-company-id';

const readContribution = (
  image: StreamRecord['NewImage'],
): ITransaction | undefined => {
  if (!image) return undefined;

  const item = unmarshall(
    image as Record<string, NativeAttributeValue>,
  ) as ITransaction;

  const { __typename: typename, status } = item;

  if (typename !== 'Transaction' || status !== TransactionStatus.Confirmed) {
    return undefined;
  }

  const companyId = transactionCompanyId(item);

  return companyId
    ? {
        ...item,
        companyId,
      }
    : undefined;
};

const applyBalance = async (
  documentClient: DynamoDBClient,
  tableName: string,
  { dynamodb, eventID }: DynamoDBRecord,
): Promise<string[]> => {
  const eventId = eventID as string;
  const previous = readContribution(dynamodb?.OldImage);
  const current = readContribution(dynamodb?.NewImage);

  if (previous && current) {
    if (previous.companyId === current.companyId) {
      await update(documentClient, tableName, previous, current, eventId);
    } else {
      await move(documentClient, tableName, previous, current, eventId);
    }
  } else if (current) {
    await insert(documentClient, tableName, current, eventId);
  } else if (previous) {
    await remove(documentClient, tableName, previous, eventId);
  }

  return [
    ...new Set(
      [previous, current].flatMap((record) =>
        record ? [record.companyId] : [],
      ),
    ),
  ];
};

export default applyBalance;
