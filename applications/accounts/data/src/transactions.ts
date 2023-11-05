import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import logger from '@motech-development/node-logger';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { AWSLambda } from '@sentry/serverless';
import { DynamoDBStreamHandler } from 'aws-lambda';
import removeTransactions from './handlers/remove-transactions';
import insertTransactions from './handlers/insert-transactions';
import updateTransactions from './handlers/update-transactions';
import extractStream from './shared/extract-stream';

AWSLambda.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new ProfilingIntegration()],
  profilesSampleRate: 1.0,
  tracesSampleRate: 1.0,
});

const documentClient = new DynamoDBClient({});

export const handler: DynamoDBStreamHandler = AWSLambda.wrapHandler(
  async (event) => {
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
  },
);
