import { join, resolve } from 'node:path';
import {
  createDirectory,
  downloadFile,
} from '@motech-development/s3-file-operations';
import { Handler } from 'aws-lambda';
import { scanFile } from '../shared/clam-av';
import virusDefinitions from '../shared/virus-definitions';

export interface IEvent {
  from: string;
  key: string;
  to: string;
}

export const handler: Handler<IEvent> = async (event) => {
  const { BUCKET } = process.env;

  if (!BUCKET) {
    throw new Error('No bucket set');
  }

  const tempDir = resolve('/tmp');
  const downloadsDir = join(tempDir, 'downloads');
  const downloadsDirExists = await createDirectory(downloadsDir);
  const { from, key, to } = event;
  const file = downloadFile(from, key, downloadsDir);
  const definitions = downloadsDirExists
    ? []
    : virusDefinitions.map((definition) =>
        downloadFile(BUCKET, definition, tempDir),
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
