import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import logger from '@motech-development/node-logger';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { AWSLambda } from '@sentry/serverless';
import { DynamoDBStreamHandler } from 'aws-lambda';
import insertTypeahead from './handlers/insert-typeahead';
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
    const { TABLE, inserts, updates } = extractStream(event);

    try {
      await Promise.all([
        ...insertTypeahead(documentClient, TABLE, inserts),
        ...insertTypeahead(documentClient, TABLE, updates),
      ]);
    } catch (e) {
      logger.error('An error occurred', e);
    }
  },
);
