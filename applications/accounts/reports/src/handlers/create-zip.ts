import { Handler } from 'aws-lambda';
import { join } from 'node:path';
import { v4 as uuid } from 'uuid';
import { array, object, string } from 'yup';
import archive from '../shared/archive';

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

export const handler: Handler<IEvent> = async (event) => {
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

  return {
    companyId,
    key,
    owner,
  };
};
