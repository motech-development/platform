import { SQSClient } from '@aws-sdk/client-sqs';
import logger from '@motech-development/node-logger';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { AWSLambda } from '@sentry/serverless';
import { DynamoDBStreamHandler } from 'aws-lambda';
import deleteAttachments from './handlers/delete-attachments';

AWSLambda.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new ProfilingIntegration()],
  profilesSampleRate: 1.0,
  tracesSampleRate: 1.0,
});

const sqs = new SQSClient({});

export const handler: DynamoDBStreamHandler = AWSLambda.wrapHandler(
  async (event) => {
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
  },
);
