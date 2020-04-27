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

  const params: DocumentClient.TransactWriteItemsInput = {
    TransactItems: [
      ...insertTransactions(TABLE, inserts),
      ...updateTransactions(TABLE, updates),
      ...deleteTransactions(TABLE, removals),
    ],
  };

  if (params.TransactItems.length > 0) {
    await documentClient.transactWrite(params).promise();
  }

  return Promise.resolve();
};
