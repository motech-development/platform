import { Handler } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const { TABLE } = process.env;
const documentClient = new DocumentClient();

interface IEvent {
  continue: boolean;
  count: number;
  current: 0;
  items: string[][];
}

export const handler: Handler<IEvent> = async event => {
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
    continue: current === count,
    current: current + 1,
  };
};
