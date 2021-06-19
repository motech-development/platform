import { DynamoDBStreamHandler } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import insertTypeahead from './handlers/insert-typeahead';
import extractStream from './shared/extract-stream';

const documentClient = new DocumentClient();

export const handler: DynamoDBStreamHandler = async (event) => {
  const { TABLE, inserts, updates } = extractStream(event);

  try {
    await Promise.all([
      ...insertTypeahead(documentClient, TABLE, inserts),
      ...insertTypeahead(documentClient, TABLE, updates),
    ]);
  } catch (e) {
    console.error(e.message);
  }
};
