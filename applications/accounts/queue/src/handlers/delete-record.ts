import { Handler } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const documentClient = new DocumentClient();

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

  await documentClient
    .delete({
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
    })
    .promise();

  return {
    complete: true,
  };
};
