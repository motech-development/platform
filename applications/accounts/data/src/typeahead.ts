import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import logger from '@motech-development/node-logger';
import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { DynamoDBStreamHandler } from 'aws-lambda';
import insertTypeahead from './handlers/insert-typeahead';
import extractStream from './shared/extract-stream';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profilesSampleRate: 1.0,
  tracesSampleRate: 1.0,
});

const documentClient = new DynamoDBClient({});

export const handler: DynamoDBStreamHandler = wrapHandler(async (event) => {
  const { TABLE, inserts, updates } = extractStream(event);

  try {
    await Promise.all([
      ...insertTypeahead(documentClient, TABLE, inserts),
      ...insertTypeahead(documentClient, TABLE, updates),
    ]);
  } catch (e) {
    logger.error('An error occurred', e);
  }
});
