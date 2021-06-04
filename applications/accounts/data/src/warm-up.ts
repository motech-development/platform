import logger from '@motech-development/logger';
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
  maxAttempts = 6,
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

  logger.info('Result from database', {
    Item,
    attempts,
    maxAttempts,
  });

  if (Item && attempts < maxAttempts) {
    logger.info('Item found, sleeping for 3 minutes');

    await wait(180000);

    logger.info('Try polling again');

    return poll(id, table, maxAttempts, attempts + 1);
  }

  logger.info('Polling complete');

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

  logger.info('Inserting warm up record', {
    id,
  });

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

  logger.info('Starting to poll database');

  const complete = await poll(id, TABLE);

  logger.info('Polling complete', {
    complete,
  });

  if (complete) {
    return {
      complete,
    };
  }

  throw new Error('Database has not warmed up');
};
