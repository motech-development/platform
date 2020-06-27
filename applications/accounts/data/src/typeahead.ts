import { DynamoDBStreamHandler } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import insertTypeahead from './handlers/insert-typeahead';

const documentClient = new DocumentClient();

export const handler: DynamoDBStreamHandler = async event => {
  const { TABLE } = process.env;

  if (!TABLE) {
    throw new Error('No table set');
  }

  const inserts = event.Records.filter(
    ({ eventName }) => eventName === 'INSERT',
  );
  const updates = event.Records.filter(
    ({ eventName }) => eventName === 'MODIFY',
  );

  try {
    await Promise.all([
      ...insertTypeahead(documentClient, TABLE, inserts),
      ...insertTypeahead(documentClient, TABLE, updates),
    ]);
  } catch (e) {
    console.error(e.message);
  }
};
