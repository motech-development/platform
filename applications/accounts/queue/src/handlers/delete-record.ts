import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { Handler } from 'aws-lambda';

const documentClient = new DynamoDBClient({});

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

  const command = new DeleteCommand({
    ConditionExpression: '#owner = :owner',
    ExpressionAttributeNames: {
      '#owner': 'owner',
    },
    ExpressionAttributeValues: {
      ':owner': owner,
    },
    Key: {
      __typename: TYPENAME,
      id,
    },
    TableName: TABLE,
  });

  await documentClient.send(command);

  return {
    complete: true,
  };
};
