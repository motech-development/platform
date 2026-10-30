import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type { Handler } from 'aws-lambda';
import { json2csv } from 'json-2-csv';
import type { InferType } from 'yup';
import { array, object, string } from 'yup';
import {
  readReportPayload,
  writeReportPayload,
} from '../shared/report-payload';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profileLifecycle: 'trace',
  profileSessionSampleRate: 1,
  tracesSampleRate: 1,
});

const eventSchema = object({
  companyId: string().required(),
  owner: string().required(),
  payloadKey: string().required(),
}).required();

const schema = object({
  attachments: array(
    object({
      key: string().required(),
      path: string().required(),
    }).required(),
  ),
  companyId: string().required(),
  csv: array(
    object({
      Category: string().required(),
      Date: string().required(),
      Description: string().required(),
      In: string().nullable(),
      Name: string().required(),
      Out: string().nullable(),
    }).required(),
  ).required(),
  owner: string().required(),
}).required();

export type IEvent = InferType<typeof eventSchema>;

export interface IOutput {
  companyId: string;
  owner: string;
  payloadKey: string;
}

export const handler: Handler<IEvent, IOutput> = wrapHandler(async (event) => {
  const { REPORT_BUCKET } = process.env;

  if (!REPORT_BUCKET) {
    throw new Error('No report bucket set');
  }

  const input = await eventSchema.validate(event, {
    abortEarly: true,
    stripUnknown: true,
  });
  const payload = await readReportPayload(REPORT_BUCKET, input.payloadKey);
  const { attachments, companyId, csv, owner } = await schema.validate(
    payload,
    {
      abortEarly: true,
      stripUnknown: true,
    },
  );
  const report = await json2csv(csv, {
    checkSchemaDifferences: true,
  });

  const convertedPayload = {
    attachments,
    companyId,
    csv: report,
    owner,
  };

  await writeReportPayload(REPORT_BUCKET, input.payloadKey, convertedPayload);

  return {
    companyId: input.companyId,
    owner: input.owner,
    payloadKey: input.payloadKey,
  };
});
