// TODO: Publish to queue instead
import { Handler } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const { TABLE } = process.env;
const documentClient = new DocumentClient();

interface IEvent {
  arguments: {
    id: string;
  };
  field: string;
  owner: string;
}

export const handler: Handler<IEvent> = async event => {
  if (!TABLE) {
    throw new Error('No table set');
  }

  const { field, owner } = event;

  if (field !== 'deleteClients') {
    throw new Error('Incorrect field');
  }

  const { id } = event.arguments;

  const clients = await documentClient
    .query({
      ExpressionAttributeNames: {
        '#data': 'data',
        '#owner': 'owner',
        '#typename': '__typename',
      },
      ExpressionAttributeValues: {
        ':data': `${owner}:${id}`,
        ':owner': owner,
        ':typename': 'Client',
      },
      FilterExpression: '#owner = :owner',
      IndexName: '__typename-data-index',
      KeyConditionExpression:
        '#typename = :typename AND begins_with(#data, :data)',
      ProjectionExpression: 'id',
      TableName: TABLE,
    })
    .promise();

  // TODO: Chunk operation
  if (clients.Items && clients.Items.length > 0) {
    await documentClient
      .batchWrite({
        RequestItems: {
          [TABLE]: [
            ...clients.Items.map(item => ({
              DeleteRequest: {
                Key: {
                  __typename: 'Client',
                  id: item.id,
                },
              },
            })),
          ],
        },
      })
      .promise();
  }
};
