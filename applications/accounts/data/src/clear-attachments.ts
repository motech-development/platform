import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import logger from '@motech-development/node-logger';
import { captureException, init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type { SQSHandler } from 'aws-lambda';
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

  const results = await Promise.allSettled(
    event.Records.map(async (record) => {
      try {
        const updates = await updateAttachments(documentClient, TABLE, BUCKET, [
          record,
        ]);

        await Promise.all(updates);
      } catch (e) {
        logger.error('An error occurred', e);

        throw e;
      }
    }),
  );

  return {
    batchItemFailures: results.flatMap((result, index) => {
      if (result.status === 'fulfilled') return [];

      captureException(result.reason);

      return [
        {
          itemIdentifier: event.Records[index].messageId,
        },
      ];
    }),
  };
});
