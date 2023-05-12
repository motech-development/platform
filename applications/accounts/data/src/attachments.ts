import { SQSClient } from '@aws-sdk/client-sqs';
import logger from '@motech-development/node-logger';
import { DynamoDBStreamHandler } from 'aws-lambda';
import deleteAttachments from './handlers/delete-attachments';

const sqs = new SQSClient({});

export const handler: DynamoDBStreamHandler = async (event) => {
  const { ATTACHMENT_QUEUE } = process.env;

  if (!ATTACHMENT_QUEUE) {
    throw new Error('No attachment queue set');
  }

  const removals = event.Records.filter(
    ({ eventName }) => eventName === 'REMOVE',
  );

  try {
    await deleteAttachments(sqs, ATTACHMENT_QUEUE, removals);
  } catch (e) {
    logger.error('An error occurred', e);
  }
};
