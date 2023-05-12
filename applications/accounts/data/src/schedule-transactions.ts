import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import logger from '@motech-development/node-logger';
import { DynamoDBStreamHandler } from 'aws-lambda';
import insertScheduledTransactions from './handlers/insert-scheduled-transactions';
import removeScheduledTransactions from './handlers/remove-scheduled-transactions';
import updateScheduledTransactions from './handlers/update-scheduled-transactions';
import extractStream from './shared/extract-stream';

const documentClient = new DynamoDBClient({});

export const handler: DynamoDBStreamHandler = async (event) => {
  const { TABLE, inserts, removals, updates } = extractStream(event);

  try {
    await Promise.all<unknown>([
      ...insertScheduledTransactions(documentClient, TABLE, inserts),
      ...updateScheduledTransactions(documentClient, TABLE, updates),
      ...removeScheduledTransactions(documentClient, TABLE, removals),
    ]);
  } catch (e) {
    logger.error('An error occurred', e);
  }
};
