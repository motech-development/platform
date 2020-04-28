import { DynamoDBStreamHandler } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import deleteTransactions from './handlers/delete-transactions';
import insertTransactions from './handlers/insert-transactions';
import updateTransactions from './handlers/update-transactions';

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
  const removals = event.Records.filter(
    ({ eventName }) => eventName === 'REMOVE',
  );

  try {
    await Promise.all([
      ...insertTransactions(documentClient, TABLE, inserts),
      ...updateTransactions(documentClient, TABLE, updates),
      ...deleteTransactions(documentClient, TABLE, removals),
    ]);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e.message);
  }
};
