import logger from '@motech-development/node-logger';
import { DynamoDBStreamHandler } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import confirmTransactions from './handlers/confirm-transactions';
import extractStream from './shared/extract-stream';

const documentClient = new DocumentClient();

export const handler: DynamoDBStreamHandler = async (event) => {
  const { TABLE, removals } = extractStream(event);

  try {
    await Promise.all([
      ...confirmTransactions(documentClient, TABLE, removals),
    ]);
  } catch (e) {
    logger.error('An error occurred', e);
  }
};
