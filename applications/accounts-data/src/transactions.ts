import { DynamoDBStreamHandler } from 'aws-lambda';
import { SQS } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import deleteAttachments from './handlers/delete-attachments';
import removeTransactions from './handlers/remove-transactions';
import insertTransactions from './handlers/insert-transactions';
import updateTransactions from './handlers/update-transactions';

const documentClient = new DocumentClient();
const sqs = new SQS();

export const handler: DynamoDBStreamHandler = async event => {
  const { ATTACHMENT_QUEUE, TABLE } = process.env;

  if (!TABLE) {
    throw new Error('No table set');
  }

  if (!ATTACHMENT_QUEUE) {
    throw new Error('No attachment queue set');
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
      ...insertTransactions(documentClient, TABLE, inserts),
      ...updateTransactions(documentClient, TABLE, updates),
      ...removeTransactions(documentClient, TABLE, removals),
      deleteAttachments(sqs, ATTACHMENT_QUEUE, removals),
    ]);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e.message);
  }
};
