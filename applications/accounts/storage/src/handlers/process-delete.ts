import { deleteFile } from '@motech-development/s3-file-operations';
import { SQSHandler } from 'aws-lambda';

export const handler: SQSHandler = async (event) => {
  const { DOWNLOAD_BUCKET } = process.env;

  if (!DOWNLOAD_BUCKET) {
    throw new Error('No destination bucket set');
  }

  const deletions = event.Records.map((record) => {
    const { messageAttributes } = record;
    const { key } = messageAttributes;

    if (key && key.stringValue) {
      return deleteFile(DOWNLOAD_BUCKET, key.stringValue);
    }

    return null;
  });

  await Promise.all(deletions);
};
