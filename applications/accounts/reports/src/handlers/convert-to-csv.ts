import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type { Handler } from 'aws-lambda';
import { json2csv } from 'json-2-csv';
import type { InferType } from 'yup';
import { array, object, string } from 'yup';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profileLifecycle: 'trace',
  profileSessionSampleRate: 1,
  tracesSampleRate: 1,
});

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

type ICsvRow = Omit<InferType<typeof schema>['csv'][number], 'In' | 'Out'> & {
  In: Exclude<InferType<typeof schema>['csv'][number]['In'], undefined>;
  Out: Exclude<InferType<typeof schema>['csv'][number]['Out'], undefined>;
};

export type IEvent = Omit<InferType<typeof schema>, 'attachments' | 'csv'> & {
  attachments: NonNullable<InferType<typeof schema>['attachments']>;
  csv: ICsvRow[];
};

export const handler: Handler<IEvent> = wrapHandler(async (event) => {
  const { attachments, companyId, csv, owner } = await schema.validate(event, {
    abortEarly: true,
    stripUnknown: true,
  });
  const report = await json2csv(csv, {
    checkSchemaDifferences: true,
  });

  return {
    attachments,
    companyId,
    csv: report,
    owner,
  };
});
