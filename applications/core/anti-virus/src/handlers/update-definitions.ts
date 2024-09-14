import { createReadStream } from 'node:fs';
import { join } from 'node:path';
import logger from '@motech-development/node-logger';
import { createFile } from '@motech-development/s3-file-operations';
import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { Handler } from 'aws-lambda';
import { updateDefinitions } from '../shared/clam-av';
import virusDefinitions from '../shared/virus-definitions';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profilesSampleRate: 1.0,
  tracesSampleRate: 1.0,
});

export const handler: Handler = wrapHandler(async () => {
  const { BUCKET } = process.env;

  if (!BUCKET) {
    throw new Error('No bucket set');
  }

  const tmpDir = '/tmp';

  try {
    await updateDefinitions(tmpDir);

    const upload = virusDefinitions.map((definition) => {
      const path = join(tmpDir, definition);
      const body = createReadStream(path);
      const key = definition;

      return createFile(BUCKET, key, body);
    });

    await Promise.all(upload);

    return 'OK';
  } catch (e) {
    logger.error(e);

    throw new Error('Unable to update virus definitions');
  }
});
