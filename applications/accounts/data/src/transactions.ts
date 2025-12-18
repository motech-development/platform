import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import logger from '@motech-development/node-logger';
import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type { DynamoDBStreamHandler } from 'aws-lambda';
import insertTransactions from './handlers/insert-transactions';
import removeTransactions from './handlers/remove-transactions';
import updateTransactions from './handlers/update-transactions';
import extractStream from './shared/extract-stream';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profilesSampleRate: 1.0,
  tracesSampleRate: 1.0,
});

const documentClient = new DynamoDBClient({});

export const handler: DynamoDBStreamHandler = wrapHandler(async (event) => {
  const { TABLE, inserts, removals, updates } = extractStream(event);

  try {
    await Promise.all([
      ...insertTransactions(documentClient, TABLE, inserts),
      ...updateTransactions(documentClient, TABLE, updates),
      ...removeTransactions(documentClient, TABLE, removals),
    ]);
  } catch (e) {
    logger.error('An error occurred', e);
  }
});
