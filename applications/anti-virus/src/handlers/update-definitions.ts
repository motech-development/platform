import { Handler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { createReadStream } from 'fs';
import { join } from 'path';
import { updateDefinitions } from '../shared/clam-av';
import virusDefinitions from '../shared/virus-definitions';

const s3 = new S3();

export const handler: Handler = async () => {
  const { BUCKET } = process.env;

  if (!BUCKET) {
    throw new Error('No bucket set');
  }

  const tmpDir = '/tmp';

  try {
    await updateDefinitions(tmpDir);

    const upload = virusDefinitions.map(definition => {
      const path = join(tmpDir, definition);
      const body = createReadStream(path);
      const key = definition;

      return s3
        .putObject({
          Body: body,
          Bucket: BUCKET,
          Key: key,
        })
        .promise();
    });

    await Promise.all(upload);

    return 'OK';
  } catch (e) {
    throw new Error('Unable to update virus definitions');
  }
};
