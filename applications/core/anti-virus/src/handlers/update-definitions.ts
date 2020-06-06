import { Handler } from 'aws-lambda';
import { createReadStream } from 'fs';
import { join } from 'path';
import { updateDefinitions } from '../shared/clam-av';
import { createFile } from '../shared/file-operations';
import virusDefinitions from '../shared/virus-definitions';

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

      return createFile(BUCKET, key, body);
    });

    await Promise.all(upload);

    return 'OK';
  } catch (e) {
    throw new Error('Unable to update virus definitions');
  }
};
