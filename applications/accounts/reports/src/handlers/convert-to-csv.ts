import { Handler } from 'aws-lambda';
import { json2csvAsync } from 'json-2-csv';
import { array, object, string } from 'yup';

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
  attachments: {
    key: string;
    path: string;
  }[];
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
  const { attachments, companyId, csv, owner } = await schema.validate(event, {
    abortEarly: true,
    stripUnknown: true,
  });
  const report = await json2csvAsync(csv, {
    checkSchemaDifferences: true,
  });

  return {
    attachments,
    companyId,
    csv: report,
    owner,
  };
};
