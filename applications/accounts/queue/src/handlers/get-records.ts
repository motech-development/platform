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

const documentClient = new DynamoDBClient({});

const isItem = (item: Record<string, NativeAttributeValue>): item is IItem =>
  !!item.id;

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

const PAGE_SIZE = 25;

export const handler: Handler<IEvent, IOutput> = wrapHandler(async (event) => {
  const { TABLE, TYPENAME } = process.env;

  if (!TABLE) {
    throw new Error('No table set');
  }

  if (!TYPENAME) {
    throw new Error('No typename set');
  }

  const { id, owner } = event;

  const command = new QueryCommand({
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
    Limit: PAGE_SIZE,
    ProjectionExpression: 'id',
    ...(hasContinuationKey(event.lastEvaluatedKey)
      ? { ExclusiveStartKey: event.lastEvaluatedKey }
      : {}),
    TableName: TABLE,
  });

  const { Items, LastEvaluatedKey } = await documentClient.send(command);

  const items = (Items ?? []).filter(isItem).map((item) => item.id);
  const hasMoreRecords = hasContinuationKey(LastEvaluatedKey);

  return {
    complete: !hasMoreRecords,
    id,
    items,
    ...(hasMoreRecords ? { lastEvaluatedKey: LastEvaluatedKey } : {}),
    owner,
  };
});
