import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import logger from '@motech-development/node-logger';
import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type { DynamoDBRecord, DynamoDBStreamHandler } from 'aws-lambda';
import insertTransactions from './handlers/insert-transactions';
import removeTransactions from './handlers/remove-transactions';
import updateTransactions from './handlers/update-transactions';
import extractStream from './shared/extract-stream';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profileLifecycle: 'trace',
  profileSessionSampleRate: 1,
  tracesSampleRate: 1,
});

const documentClient = new DynamoDBClient({});

const processRecord = (tableName: string, record: DynamoDBRecord) => {
  if (record.eventName === 'INSERT') {
    return Promise.all(insertTransactions(documentClient, tableName, [record]));
  }

  if (record.eventName === 'MODIFY') {
    return Promise.all(updateTransactions(documentClient, tableName, [record]));
  }

  if (record.eventName === 'REMOVE') {
    return Promise.all(removeTransactions(documentClient, tableName, [record]));
  }

  return Promise.resolve([]);
};

export const handler: DynamoDBStreamHandler = wrapHandler(async (event) => {
  const { TABLE } = extractStream(event);

  try {
    await event.Records.reduce(
      (previous, record) =>
        previous.then(() => processRecord(TABLE, record)).then(() => undefined),
      Promise.resolve(),
    );
  } catch (e) {
    logger.error('An error occurred', e);

    throw e;
  }
});
