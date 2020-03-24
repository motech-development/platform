import { Handler } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const documentClient = new DocumentClient();

export interface IEvent {
  count: number;
  current: number;
  items: string[][];
}

export const handler: Handler<IEvent> = async event => {
  const { TABLE } = process.env;

  if (!TABLE) {
    throw new Error('No table set');
  }

  const { count, current, items } = event;

  await documentClient
    .batchWrite({
      RequestItems: {
        [TABLE]: [
          ...items[current].map(id => ({
            DeleteRequest: {
              Key: {
                __typename: 'Client',
                id,
              },
            },
          })),
        ],
      },
    })
    .promise();

  return {
    ...event,
    complete: current === count - 1,
    current: current + 1,
  };
};
