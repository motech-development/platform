import { SQSClient } from '@aws-sdk/client-sqs';
import logger from '@motech-development/node-logger';
import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type { DynamoDBStreamHandler } from 'aws-lambda';
import deleteAttachments from './handlers/delete-attachments';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profilesSampleRate: 1.0,
  tracesSampleRate: 1.0,
});

const sqs = new SQSClient({});

export const handler: DynamoDBStreamHandler = wrapHandler(async (event) => {
  const { ATTACHMENT_QUEUE } = process.env;

  if (!ATTACHMENT_QUEUE) {
    throw new Error('No attachment queue set');
  }

  const removals = event.Records.filter(
    ({ eventName }) => eventName === 'REMOVE',
  );

  try {
    await deleteAttachments(sqs, ATTACHMENT_QUEUE, removals);
  } catch (e) {
    logger.error('An error occurred', e);
  }
});
