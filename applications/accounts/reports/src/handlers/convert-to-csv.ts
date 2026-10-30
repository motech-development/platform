import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type { Handler } from 'aws-lambda';
import { json2csv } from 'json-2-csv';
import { array, object, string } from 'yup';
import {
  type IReportPayloadReference,
  readReportPayloadEvent,
  reportPayloadEventSchema,
  reportPayloadMetadataSchema,
  writeReportPayload,
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
  })
  .required();

export type IEvent = IReportPayloadReference;

export type IOutput = IReportPayloadReference;

export const handler: Handler<IEvent, IOutput> = wrapHandler(async (event) => {
  const { bucket, input, payload } = await readReportPayloadEvent(
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
  const report = await json2csv(csv, {
    checkSchemaDifferences: true,
  });

  const convertedPayload = {
    attachments,
    companyId,
    csv: report,
    owner,
  };

  await writeReportPayload(bucket, input.payloadKey, convertedPayload);

  return {
    companyId: input.companyId,
    owner: input.owner,
    payloadKey: input.payloadKey,
  };
});
