import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import logger from '@motech-development/node-logger';
import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { SQSHandler } from 'aws-lambda';
import updateAttachments from './handlers/update-attachments';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profilesSampleRate: 1.0,
  tracesSampleRate: 1.0,
});

const documentClient = new DynamoDBClient({});

export const handler: SQSHandler = wrapHandler(async (event) => {
  const { BUCKET, TABLE } = process.env;

  if (!TABLE) {
    throw new Error('No table set');
  }

  if (!BUCKET) {
    throw new Error('No source bucket set');
  }

  const { Records } = event;

  try {
    const updates = await updateAttachments(
      documentClient,
      TABLE,
      BUCKET,
      Records,
    );

    await Promise.all(updates);
  } catch (e) {
    logger.error('An error occurred', e);
  }
});
