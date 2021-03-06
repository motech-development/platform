import { Handler } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import chunk from '../shared/chunk';

const documentClient = new DocumentClient();

export interface IEvent {
  id: string;
  owner: string;
}

export const handler: Handler<IEvent> = async event => {
  const { TABLE, TYPENAME } = process.env;

  if (!TABLE) {
    throw new Error('No table set');
  }

  if (!TYPENAME) {
    throw new Error('No typename set');
  }

  const { id, owner } = event;

  const { Items } = await documentClient
    .query({
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
    })
    .promise();

  if (Items && Items.length > 0) {
    const items = chunk(
      Items.map(item => item.id),
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
