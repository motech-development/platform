import { join } from 'node:path';
import logger from '@motech-development/node-logger';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { AWSLambda } from '@sentry/serverless';
import { Handler } from 'aws-lambda';
import { v4 as uuid } from 'uuid';
import { array, object, string } from 'yup';
import archive from '../shared/archive';

AWSLambda.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new ProfilingIntegration()],
  profilesSampleRate: 1.0,
  tracesSampleRate: 1.0,
});

const schema = object({
  attachments: array(
    object({
      key: string().required(),
      path: string().required(),
    }).required(),
  ),
  companyId: string().required(),
  csv: string().required(),
  owner: string().required(),
}).required();

export interface IEvent {
  attachments: {
    key: string;
    path: string;
  }[];
  companyId: string;
  csv: string;
  owner: string;
}

export const handler: Handler<IEvent> = AWSLambda.wrapHandler(async (event) => {
  logger.info('Start lambda function');

  const { DESTINATION_BUCKET, ORIGIN_BUCKET } = process.env;

  if (!DESTINATION_BUCKET) {
    throw new Error('No destination bucket set');
  }

  if (!ORIGIN_BUCKET) {
    throw new Error('No origin bucket set');
  }

  const { attachments, companyId, csv, owner } = await schema.validate(event, {
    abortEarly: true,
    stripUnknown: true,
  });

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
