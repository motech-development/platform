import { DynamoDBStreamHandler } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import removeTransactions from './handlers/remove-transactions';
import insertTransactions from './handlers/insert-transactions';
import updateTransactions from './handlers/update-transactions';
import extractStream from './shared/extract-stream';

const documentClient = new DocumentClient();

export const handler: DynamoDBStreamHandler = async event => {
  const { TABLE, inserts, removals, updates } = extractStream(event);

  try {
    await Promise.all([
      ...insertTransactions(documentClient, TABLE, inserts),
      ...updateTransactions(documentClient, TABLE, updates),
      ...removeTransactions(documentClient, TABLE, removals),
    ]);
  } catch (e) {
    console.error(e.message);
  }
};
