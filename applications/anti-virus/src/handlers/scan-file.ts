import { Handler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { join, resolve } from 'path';
import { scanFile } from '../shared/clam-av';
import { createDirectory, downloadFile } from '../shared/file-operations';
import virusDefinitions from '../shared/virus-definitions';

const s3 = new S3();

interface IEvent {
  from: string;
  key: string;
  to: string;
}

export const handler: Handler<IEvent> = async event => {
  const { BUCKET } = process.env;

  if (!BUCKET) {
    throw new Error('No bucket set');
  }

  const tempDir = resolve('/tmp');
  const downloadsDir = join(tempDir, 'downloads');

  await createDirectory(downloadsDir);

  const { from, key, to } = event;
  const file = downloadFile(s3, from, key, downloadsDir);
  const definitions = virusDefinitions.map(definition =>
    downloadFile(s3, BUCKET, definition, tempDir),
  );
  const [downloadedFile] = await Promise.all([file, ...definitions]);
  const result = await scanFile(downloadedFile, tempDir);

  return {
    from,
    key,
    result,
    to,
  };
};
