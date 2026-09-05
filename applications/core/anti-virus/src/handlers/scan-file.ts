import { join, resolve } from 'node:path';
import {
  createDirectory,
  deleteFile,
  downloadFile,
  getFileData,
  getStagedFile,
  isMissingFile,
} from '@motech-development/s3-file-operations';
import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type { Handler } from 'aws-lambda';
import { scanFile } from '../shared/clam-av';
import virusDefinitions from '../shared/virus-definitions';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profileLifecycle: 'trace',
  profileSessionSampleRate: 1,
  tracesSampleRate: 1,
});

export interface IEvent {
  from: string;
  key: string;
  managed?: boolean;
  to: string;
}

export const handler: Handler<IEvent> = wrapHandler(async (event) => {
  const { BUCKET } = process.env;

  if (!BUCKET) {
    throw new Error('No bucket set');
  }

  const { from, key, to } = event;
  const data = await getFileData(from, key).catch((error: unknown) => {
    if (isMissingFile(error)) return undefined;
    throw error;
  });
  if (!data) return { ...event, cancelled: true };
  const managed =
    event.managed || data.Metadata?.['attachment-lifecycle'] === 'v1';
  if (managed && (await getStagedFile(to, key))?.state !== 'pending') {
    await deleteFile(from, key);
    return { ...event, cancelled: true };
  }

  const tempDir = resolve('/tmp');
  const downloadsDir = join(tempDir, 'downloads');
  const downloadsDirExists = await createDirectory(downloadsDir);
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
    ...(managed ? { managed } : {}),
    result,
    to,
  };
});
