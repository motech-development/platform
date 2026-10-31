import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb';
import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type { Handler } from 'aws-lambda';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profileLifecycle: 'trace',
  profileSessionSampleRate: 1,
  tracesSampleRate: 1,
});

interface IItem {
  id: string;
}

interface IReceiptIndexItem {
  __typename: string;
  owner: string;
}

const documentClient = new DynamoDBClient({});
const receiptIndexPrefix = 'TransactionCreationReceiptIndex:';

const isItem = (item: Record<string, NativeAttributeValue>): item is IItem =>
  !!item.id;

const isReceiptIndexItem = (
  item: Record<string, NativeAttributeValue>,
  owner: string,
): item is IReceiptIndexItem => {
  const { __typename: typeName } = item;

  return (
    typeof typeName === 'string' &&
    typeName.startsWith(receiptIndexPrefix) &&
    typeof item.owner === 'string' &&
    item.owner === owner
  );
};

const hasContinuationKey = (
  key?: Record<string, NativeAttributeValue>,
): key is Record<string, NativeAttributeValue> =>
  !!key && Object.keys(key).length > 0;

export interface IEvent {
  id: string;
  lastEvaluatedKey?: Record<string, NativeAttributeValue>;
  owner: string;
}

export interface IOutput extends IEvent {
  complete: boolean;
  items: string[];
}

export const PAGE_SIZE = 100;
const maxStateOutputBytes = 192 * 1024;

export const handler: Handler<IEvent, IOutput> = wrapHandler(async (event) => {
  const { TABLE, TYPENAME } = process.env;

  if (!TABLE) {
    throw new Error('No table set');
  }

  if (!TYPENAME) {
    throw new Error('No typename set');
  }

  const { id, owner } = event;
  const getPage = async (pageSize: number): Promise<IOutput> => {
    const continuationKey = hasContinuationKey(event.lastEvaluatedKey)
      ? { ExclusiveStartKey: event.lastEvaluatedKey }
      : {};
    const command =
      TYPENAME === 'TransactionCreationReceipt'
        ? new QueryCommand({
            ConsistentRead: true,
            ExpressionAttributeNames: {
              '#id': 'id',
              '#owner': 'owner',
              '#typename': '__typename',
            },
            ExpressionAttributeValues: {
              ':id': id,
              ':owner': owner,
              ':typename': receiptIndexPrefix,
            },
            FilterExpression: '#owner = :owner',
            KeyConditionExpression:
              '#id = :id AND begins_with(#typename, :typename)',
            Limit: pageSize,
            ProjectionExpression: '#typename, #owner',
            ...continuationKey,
            TableName: TABLE,
          })
        : new QueryCommand({
            ExpressionAttributeNames: {
              '#data': 'data',
              '#owner': 'owner',
              '#typename': '__typename',
            },
            ExpressionAttributeValues: {
              ':data': `${owner}:${id}`,
              ':owner': owner,
              ':typename': TYPENAME,
            },
            FilterExpression: '#owner = :owner',
            IndexName: '__typename-data-index',
            KeyConditionExpression:
              '#typename = :typename AND begins_with(#data, :data)',
            Limit: pageSize,
            ProjectionExpression: 'id',
            ...continuationKey,
            TableName: TABLE,
          });

    const { Items, LastEvaluatedKey } = await documentClient.send(command);
    const items =
      TYPENAME === 'TransactionCreationReceipt'
        ? (Items ?? [])
            .filter((item) => isReceiptIndexItem(item, owner))
            .map(({ __typename: typeName }) =>
              typeName.slice(receiptIndexPrefix.length),
            )
        : (Items ?? []).filter(isItem).map((item) => item.id);
    const hasMoreRecords = hasContinuationKey(LastEvaluatedKey);
    const result: IOutput = {
      complete: !hasMoreRecords,
      id,
      items,
      ...(hasMoreRecords ? { lastEvaluatedKey: LastEvaluatedKey } : {}),
      owner,
    };
    const serializedResult = JSON.stringify(result);

    if (Buffer.byteLength(serializedResult) <= maxStateOutputBytes) {
      return result;
    }

    if (pageSize === 1) {
      throw new Error('Company deletion page exceeds the workflow state limit');
    }

    return getPage(Math.max(1, Math.floor(pageSize / 2)));
  };

  return getPage(PAGE_SIZE);
});
