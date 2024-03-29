import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import logger from '@motech-development/node-logger';
import { DynamoDBStreamHandler } from 'aws-lambda';
import insertTypeahead from './handlers/insert-typeahead';
import extractStream from './shared/extract-stream';

const documentClient = new DynamoDBClient({});

export const handler: DynamoDBStreamHandler = async (event) => {
  const { TABLE, inserts, updates } = extractStream(event);

  try {
    await Promise.all([
      ...insertTypeahead(documentClient, TABLE, inserts),
      ...insertTypeahead(documentClient, TABLE, updates),
    ]);
  } catch (e) {
    logger.error('An error occurred', e);
  }
};
