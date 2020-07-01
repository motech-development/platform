import { DynamoDBStreamHandler } from 'aws-lambda';
import { SQS } from 'aws-sdk';
import deleteAttachments from './handlers/delete-attachments';

const sqs = new SQS();

export const handler: DynamoDBStreamHandler = async event => {
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
    console.error(e.message);
  }
};
