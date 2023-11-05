import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import logger from '@motech-development/node-logger';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { AWSLambda } from '@sentry/serverless';
import { Handler } from 'aws-lambda';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';

AWSLambda.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new ProfilingIntegration()],
  profilesSampleRate: 1.0,
  tracesSampleRate: 1.0,
});

const client = new DynamoDBClient({});

export const handler: Handler = AWSLambda.wrapHandler(async () => {
  const { TABLE } = process.env;

  if (!TABLE) {
    throw new Error('No table set');
  }

  const id = uuid();
  const now = DateTime.utc();
  const createdAt = now.toISO() as string;
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
});
