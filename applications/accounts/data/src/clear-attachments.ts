import { SQSHandler } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import updateAttachments from './handlers/update-attachments';

const documentClient = new DocumentClient();

export const handler: SQSHandler = async (event) => {
  const { BUCKET, TABLE } = process.env;

  if (!TABLE) {
    throw new Error('No table set');
  }

  if (!BUCKET) {
    throw new Error('No source bucket set');
  }

  const { Records } = event;

  try {
    const updates = await updateAttachments(
      documentClient,
      TABLE,
      BUCKET,
      Records,
    );

    await Promise.all(updates);
  } catch (e) {
    console.error(e.message);
  }
};
