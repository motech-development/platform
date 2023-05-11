import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { Handler } from 'aws-lambda';

const documentClient = new DynamoDBClient({});

export interface IEvent {
  count: number;
  current: number;
  items: string[][];
}

export const handler: Handler<IEvent> = async (event) => {
  const { TABLE, TYPENAME } = process.env;

  if (!TABLE) {
    throw new Error('No table set');
  }

  if (!TYPENAME) {
    throw new Error('No typename set');
  }

  const { count, current, items } = event;

  const command = new BatchWriteCommand({
    RequestItems: {
      [TABLE]: [
        ...items[current].map((id) => ({
          DeleteRequest: {
            Key: {
              __typename: TYPENAME,
              id,
            },
          },
        })),
      ],
    },
  });

  await documentClient.send(command);

  return {
    ...event,
    complete: current === count - 1,
    current: current + 1,
  };
};
