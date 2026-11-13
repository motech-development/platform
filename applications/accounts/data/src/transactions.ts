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
  profileLifecycle: 'trace',
  profileSessionSampleRate: 1,
  tracesSampleRate: 1,
});

const documentClient = new DynamoDBClient({});

export const handler: DynamoDBStreamHandler = wrapHandler(async (event) => {
  const { TABLE, inserts, removals, updates } = extractStream(event);

  const writes = [
    ...insertTransactions(documentClient, TABLE, inserts),
    ...updateTransactions(documentClient, TABLE, updates),
    ...removeTransactions(documentClient, TABLE, removals),
  ];

  try {
    // Concurrent transactions on one balance cancel each other, so apply them in turn.
    await writes.reduce(
      (previous, write) => previous.then(write),
      Promise.resolve(),
    );
  } catch (e) {
    logger.error('An error occurred', e);

    throw e;
  }
});
