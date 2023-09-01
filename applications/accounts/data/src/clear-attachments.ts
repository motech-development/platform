import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import logger from '@motech-development/node-logger';
import { AWSLambda } from '@sentry/serverless';
import { SQSHandler } from 'aws-lambda';
import updateAttachments from './handlers/update-attachments';

AWSLambda.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

const documentClient = new DynamoDBClient({});

export const handler: SQSHandler = AWSLambda.wrapHandler(async (event) => {
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
