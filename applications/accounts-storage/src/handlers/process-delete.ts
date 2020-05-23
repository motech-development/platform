import { SQSHandler } from 'aws-lambda';
import { S3 } from 'aws-sdk';

const s3 = new S3();

export const handler: SQSHandler = async event => {
  const { DOWNLOAD_BUCKET } = process.env;

  if (!DOWNLOAD_BUCKET) {
    throw new Error('No destination bucket set');
  }

  const deletions = event.Records.map(record => {
    const { messageAttributes } = record;
    const { key } = messageAttributes;

    if (key && key.stringValue) {
      return s3
        .deleteObject({
          Bucket: DOWNLOAD_BUCKET,
          Key: key.stringValue,
        })
        .promise();
    }

    return null;
  });

  await Promise.all(deletions);
};
