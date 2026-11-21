import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { NativeAttributeValue, unmarshall } from '@aws-sdk/util-dynamodb';
import type { DynamoDBRecord, StreamRecord } from 'aws-lambda';
import { insert, move, remove, update } from './balance';
import { ITransaction, TransactionStatus } from './transaction';

const readContribution = (
  image: StreamRecord['NewImage'],
): ITransaction | undefined => {
  if (!image) return undefined;

  const item = unmarshall(
    image as Record<string, NativeAttributeValue>,
  ) as Partial<ITransaction>;

  const { __typename: typename, companyId, status } = item;

  return typename === 'Transaction' &&
    status === TransactionStatus.Confirmed &&
    typeof companyId === 'string' &&
    companyId.length > 0
    ? (item as ITransaction)
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

  if (previous && current && previous.companyId !== current.companyId) {
    await move(documentClient, tableName, previous, current, eventId);
  } else if (previous && current) {
    await update(documentClient, tableName, previous, current, eventId);
  } else if (current) {
    await insert(documentClient, tableName, current, eventId);
  } else if (previous) {
    await remove(documentClient, tableName, previous, eventId);
  }

  return [
    ...new Set(
      [previous?.companyId, current?.companyId].filter(
        (companyId) => companyId !== undefined,
      ),
    ),
  ];
};

export default applyBalance;
