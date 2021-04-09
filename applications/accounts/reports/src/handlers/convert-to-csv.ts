import { createFile } from '@motech-development/s3-file-operations';
import { Handler } from 'aws-lambda';
import { json2csvAsync } from 'json-2-csv';
import { join } from 'path';
import { array, object, string } from 'yup';

const schema = object({
  companyId: string().required(),
  csv: array(
    object({
      category: string().required(),
      date: string().required(),
      description: string().required(),
      in: string().nullable(),
      name: string().required(),
      out: string().nullable(),
    }).required(),
  ).required(),
  owner: string().required(),
}).required();

export interface IEvent {
  companyId: string;
  csv: {
    category: string;
    date: string;
    description: string;
    in: string | null;
    name: string;
    out: string | null;
  }[];
  owner: string;
}

export const handler: Handler<IEvent> = async (event) => {
  const { BUCKET } = process.env;

  if (!BUCKET) {
    throw new Error('No bucket set');
  }

  const { companyId, csv, owner } = await schema.validate(event, {
    abortEarly: true,
    stripUnknown: true,
  });
  const report = await json2csvAsync(csv, {
    checkSchemaDifferences: true,
  });
  const filename = join(owner, companyId, 'report.csv');

  await createFile(BUCKET, filename, report);

  return {
    companyId,
    filename,
    owner,
  };
};
