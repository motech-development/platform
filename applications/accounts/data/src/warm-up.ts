import { Handler } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';

const client = new DocumentClient();

const wait = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));

const poll = async (
  id: string,
  table: string,
  maxAttempts = 4,
  attempts = 1,
): Promise<boolean> => {
  const { Item } = await client
    .get({
      Key: {
        __typename: 'WarmUp',
        id,
      },
      TableName: table,
    })
    .promise();

  if (Item && attempts < maxAttempts) {
    await wait(60000);

    return poll(id, table, maxAttempts, attempts + 1);
  }

  return !Item;
};

export const handler: Handler = async () => {
  const { TABLE } = process.env;

  if (!TABLE) {
    throw new Error('No table set');
  }

  const id = uuid();
  const now = DateTime.utc();
  const createdAt = now.toISO();
  const ttl = Math.floor(now.toSeconds());

  await client
    .put({
      Item: {
        __typename: 'WarmUp',
        createdAt,
        data: `WarmUp:${createdAt}`,
        id,
        ttl,
      },
      TableName: TABLE,
    })
    .promise();

  const complete = await poll(id, TABLE);

  if (complete) {
    return {
      complete,
    };
  }

  throw new Error('Database has not warmed up');
};
