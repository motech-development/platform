import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { NativeAttributeValue } from '@aws-sdk/util-dynamodb';
import { Handler } from 'aws-lambda';
import chunk from '../shared/chunk';

interface IItem {
  id: string;
}

const documentClient = new DynamoDBClient({});

const isItem = (item: Record<string, NativeAttributeValue>): item is IItem =>
  !!item.id;

export interface IEvent {
  id: string;
  owner: string;
}

export const handler: Handler<IEvent> = async (event) => {
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
    ProjectionExpression: 'id',
    TableName: TABLE,
  });

  const { Items } = await documentClient.send(command);

  if (Items && Items.length > 0) {
    const items = chunk(
      Items.filter(isItem).map((item) => item.id),
      25,
    );

    return {
      complete: false,
      count: items.length,
      current: 0,
      items,
    };
  }

  return {
    complete: true,
  };
};
