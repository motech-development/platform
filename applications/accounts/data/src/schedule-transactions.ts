import { DynamoDBStreamHandler } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import insertScheduledTransactions from './handlers/insert-scheduled-transactions';
import removeScheduledTransactions from './handlers/remove-scheduled-transactions';
import updateScheduledTransactions from './handlers/update-scheduled-transactions';

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
    await Promise.all<unknown>([
      ...insertScheduledTransactions(documentClient, TABLE, inserts),
      ...updateScheduledTransactions(documentClient, TABLE, updates),
      ...removeScheduledTransactions(documentClient, TABLE, removals),
    ]);
  } catch (e) {
    console.error(e.message);
  }
};
