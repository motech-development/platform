import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import logger from '@motech-development/node-logger';
import type { DynamoDBStreamEvent } from 'aws-lambda';
import insertTypeahead from './handlers/insert-typeahead';
import extractStream from './shared/extract-stream';

const documentClient = new DynamoDBClient({});

export const updateTypeahead = async (
  event: DynamoDBStreamEvent,
): Promise<void> => {
  const { TABLE, inserts, updates } = extractStream(event);

  try {
    await Promise.all(
      insertTypeahead(documentClient, TABLE, [...inserts, ...updates]),
    );
  } catch (e) {
    logger.error('An error occurred', e);

    throw e;
  }
};
