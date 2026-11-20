import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import logger from '@motech-development/node-logger';
import type { DynamoDBStreamEvent } from 'aws-lambda';
import insertTransactions from './handlers/insert-transactions';
import removeTransactions from './handlers/remove-transactions';
import updateTransactions from './handlers/update-transactions';
import extractStream from './shared/extract-stream';

const documentClient = new DynamoDBClient({});

export const updateBalances = async (
  event: DynamoDBStreamEvent,
): Promise<void> => {
  const { TABLE, inserts, removals, updates } = extractStream(event);

  const writes = [
    ...insertTransactions(documentClient, TABLE, inserts),
    ...updateTransactions(documentClient, TABLE, updates),
    ...removeTransactions(documentClient, TABLE, removals),
  ];

  try {
    await writes.reduce(
      (previous, write) => previous.then(write),
      Promise.resolve(),
    );
  } catch (e) {
    logger.error('An error occurred', e);

    throw e;
  }
};
