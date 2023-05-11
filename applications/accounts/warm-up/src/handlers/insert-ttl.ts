import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import logger from '@motech-development/node-logger';
import { Handler } from 'aws-lambda';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';

const client = new DynamoDBClient({});

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

  const command = new PutCommand({
    Item: {
      __typename: 'WarmUp',
      createdAt,
      data: `WarmUp:${createdAt}`,
      id,
      ttl,
    },
    TableName: TABLE,
  });

  await client.send(command);

  logger.info('Starting to poll database');

  return {
    id,
  };
};
