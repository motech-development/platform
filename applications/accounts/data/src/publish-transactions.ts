import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import logger from '@motech-development/node-logger';
import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { DynamoDBStreamHandler } from 'aws-lambda';
import confirmTransactions from './handlers/confirm-transactions';
import extractStream from './shared/extract-stream';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profilesSampleRate: 1.0,
  tracesSampleRate: 1.0,
});

const documentClient = new DynamoDBClient({});

export const handler: DynamoDBStreamHandler = wrapHandler(async (event) => {
  const { TABLE, removals } = extractStream(event);

  try {
    await Promise.all([
      ...confirmTransactions(documentClient, TABLE, removals),
    ]);
  } catch (e) {
    logger.error('An error occurred', e);
  }
});
