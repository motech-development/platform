import { AWSLambda } from '@sentry/serverless';
import { Handler } from 'aws-lambda';
import { json2csv } from 'json-2-csv';
import { array, object, string } from 'yup';

AWSLambda.init({
  dsn: process.env.SENTRY_DSN,
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

export interface IEvent {
  attachments: {
    key: string;
    path: string;
  }[];
  companyId: string;
  csv: {
    Category: string;
    Date: string;
    Description: string;
    In: string | null;
    Name: string;
    Out: string | null;
  }[];
  owner: string;
}

export const handler: Handler<IEvent> = AWSLambda.wrapHandler(async (event) => {
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
