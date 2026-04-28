import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type { Handler } from 'aws-lambda';
import { AwsClient } from 'aws4fetch';
import { stringify } from 'qs';
import { number, object, string } from 'yup';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profileLifecycle: 'trace',
  profileSessionSampleRate: 1,
  tracesSampleRate: 1,
});

const schema = object({
  owner: string().required(),
  payload: object({
    createdAt: string().required(),
    downloadUrl: string().required(),
    id: string().required(),
    ttl: number().required(),
  }).required(),
}).required();

export interface IEvent {
  owner: string;
  payload: {
    createdAt: string;
    downloadUrl: string;
    id: string;
    ttl: number;
  };
}

export const handler: Handler<IEvent> = wrapHandler(async (event) => {
  const {
    AWS_ACCESS_KEY_ID,
    AWS_REGION,
    AWS_SECRET_ACCESS_KEY,
    AWS_SESSION_TOKEN,
    ENDPOINT,
    STAGE,
  } = process.env;

  if (!ENDPOINT) {
    throw new Error('No endpoint set');
  }

  if (!STAGE) {
    throw new Error('No stage set');
  }

  if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    throw new Error('No AWS credentials set');
  }

  if (!AWS_REGION) {
    throw new Error('No AWS region set');
  }

  const { owner, payload } = await schema.validate(event, {
    abortEarly: true,
    stripUnknown: true,
  });
  const path = `/${STAGE}/api/v1/notifications`;
  const url = ENDPOINT + path;
  const data = {
    message: 'REPORT_READY_TO_DOWNLOAD',
    owner,
    payload: stringify(payload),
  };

  const response = await new AwsClient({
    accessKeyId: AWS_ACCESS_KEY_ID,
    region: AWS_REGION,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    service: 'execute-api',
    sessionToken: AWS_SESSION_TOKEN,
  }).fetch(url, {
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Notification request failed');
  }

  return {
    complete: true,
  };
});
