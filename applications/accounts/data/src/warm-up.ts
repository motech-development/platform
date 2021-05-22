import { Handler } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';

const client = new DocumentClient();

export const handler: Handler = async () => {
  const { TABLE } = process.env;

  if (!TABLE) {
    throw new Error('No table set');
  }

  const owner = 'internal-user';
  const now = DateTime.utc();
  const createdAt = now.toISO();
  const ttl = Math.floor(now.toSeconds());

  await client
    .batchWrite({
      RequestItems: {
        [TABLE]: [
          ...[...Array(5)].map(() => ({
            PutRequest: {
              Item: {
                __typename: 'WarmUp',
                createdAt,
                data: `WarmUp:${createdAt}`,
                id: uuid(),
                ttl,
              },
            },
          })),
          ...[...Array(5)].map(() => ({
            PutRequest: {
              Item: {
                __typename: 'Notification',
                createdAt,
                data: `${owner}:Notification:${now.toISO()}`,
                id: uuid(),
                message: 'WARM_UP_NOTIFICATION',
                owner,
                read: false,
              },
            },
          })),
        ],
      },
    })
    .promise();

  return {
    complete: true,
  };
};
