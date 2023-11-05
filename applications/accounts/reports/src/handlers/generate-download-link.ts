import { createSignedUrl } from '@motech-development/s3-file-operations';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { AWSLambda } from '@sentry/serverless';
import { Handler } from 'aws-lambda';
import { object, string } from 'yup';

AWSLambda.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new ProfilingIntegration()],
  profilesSampleRate: 1.0,
  tracesSampleRate: 1.0,
});

const schema = object({
  companyId: string().required(),
  key: string().required(),
  owner: string().required(),
}).required();

export interface IEvent {
  companyId: string;
  key: string;
  owner: string;
}

export const handler: Handler<IEvent> = AWSLambda.wrapHandler(async (event) => {
  const { BUCKET } = process.env;

  if (!BUCKET) {
    throw new Error('No bucket set');
  }

  const { companyId, key, owner } = await schema.validate(event, {
    abortEarly: true,
    stripUnknown: true,
  });
  const downloadUrl = await createSignedUrl('getObject', BUCKET, key, 86400);

  return {
    companyId,
    downloadUrl,
    key,
    owner,
  };
});
