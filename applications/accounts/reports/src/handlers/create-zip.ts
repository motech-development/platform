import { join } from 'node:path';
import logger from '@motech-development/node-logger';
import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type { Handler } from 'aws-lambda';
import { v4 as uuid } from 'uuid';
import { string } from 'yup';
import archive from '../shared/archive';
import {
  type IReportPayloadReference,
  readReportPayloadEvent,
  reportPayloadEventSchema,
  reportPayloadMetadataSchema,
} from '../shared/report-payload';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profileLifecycle: 'trace',
  profileSessionSampleRate: 1,
  tracesSampleRate: 1,
});

const schema = reportPayloadMetadataSchema
  .shape({
    csv: string().required(),
  })
  .required();

export type IEvent = IReportPayloadReference;

export const handler: Handler<IEvent> = wrapHandler(async (event) => {
  logger.info('Start lambda function');

  const { DESTINATION_BUCKET, ORIGIN_BUCKET } = process.env;

  if (!DESTINATION_BUCKET) {
    throw new Error('No destination bucket set');
  }

  if (!ORIGIN_BUCKET) {
    throw new Error('No origin bucket set');
  }

  const { input, payload } = await readReportPayloadEvent(
    event,
    reportPayloadEventSchema,
  );
  const { attachments, companyId, csv, owner } = await schema.validate(
    payload,
    {
      abortEarly: true,
      stripUnknown: true,
    },
  );

  if (companyId !== input.companyId || owner !== input.owner) {
    throw new Error('Report payload does not match the workflow input');
  }

  const key = join(owner, companyId, `${uuid()}.zip`);

  logger.debug('Zip key', {
    key,
  });

  await archive(
    csv,
    {
      bucket: DESTINATION_BUCKET,
      key,
    },
    {
      bucket: ORIGIN_BUCKET,
      keys: attachments,
    },
  );

  logger.info('Archiving complete');

  return {
    companyId,
    key,
    owner,
  };
});
