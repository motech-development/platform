import { createReadStream } from 'node:fs';
import { join } from 'node:path';
import logger from '@motech-development/node-logger';
import { createFile } from '@motech-development/s3-file-operations';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { AWSLambda } from '@sentry/serverless';
import { Handler } from 'aws-lambda';
import { updateDefinitions } from '../shared/clam-av';
import virusDefinitions from '../shared/virus-definitions';

AWSLambda.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new ProfilingIntegration()],
  profilesSampleRate: 1.0,
  tracesSampleRate: 1.0,
});

export const handler: Handler = AWSLambda.wrapHandler(async () => {
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
