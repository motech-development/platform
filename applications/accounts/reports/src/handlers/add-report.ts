import { Handler } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';
import { object, string } from 'yup';

const client = new DocumentClient();
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

export const handler: Handler<IEvent> = async (event) => {
  const { TABLE } = process.env;

  if (!TABLE) {
    throw new Error('No table set');
  }

  const { companyId, key, owner } = await schema.validate(event, {
    abortEarly: true,
    stripUnknown: true,
  });
  const now = DateTime.utc();
  const ttl = Math.floor(
    now
      .plus({
        day: 1,
      })
      .toSeconds(),
  );

  await client
    .put({
      Item: {
        __typename: 'Report',
        createdAt: now.toISO({
          suppressMilliseconds: true,
        }),
        data: `${owner}:${companyId}:${now.toISO({
          suppressMilliseconds: true,
        })}`,
        id: uuid(),
        key,
        owner,
        ttl,
      },
      TableName: TABLE,
    })
    .promise();

  return {
    owner,
  };
};
