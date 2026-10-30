import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import logger from '@motech-development/node-logger';
import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type { SQSBatchResponse, SQSHandler } from 'aws-lambda';
import updateAttachments from './handlers/update-attachments';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profileLifecycle: 'trace',
  profileSessionSampleRate: 1,
  tracesSampleRate: 1,
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

  const batchItemFailures = await Promise.all(
    event.Records.map(async (record) => {
      try {
        await updateAttachments(documentClient, TABLE, BUCKET, record);

        return undefined;
      } catch (error) {
        logger.error('Failed to clear attachment message', {
          error,
          messageId: record.messageId,
        });

        return {
          itemIdentifier: record.messageId,
        };
      }
    }),
  );

  return {
    batchItemFailures: batchItemFailures.filter(
      (failure): failure is SQSBatchResponse['batchItemFailures'][number] =>
        failure !== undefined,
    ),
  };
});
