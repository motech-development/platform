import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { AWSLambda } from '@sentry/serverless';
import { Handler } from 'aws-lambda';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';
import { object, string } from 'yup';

AWSLambda.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

const client = new DynamoDBClient({});

const schema = object({
  companyId: string().required(),
  downloadUrl: string().required(),
  key: string().required(),
  owner: string().required(),
}).required();

export interface IEvent {
  companyId: string;
  downloadUrl: string;
  key: string;
  owner: string;
}

export const handler: Handler<IEvent> = AWSLambda.wrapHandler(async (event) => {
  const { TABLE } = process.env;

  if (!TABLE) {
    throw new Error('No table set');
  }

  const { companyId, downloadUrl, key, owner } = await schema.validate(event, {
    abortEarly: true,
    stripUnknown: true,
  });
  const now = DateTime.utc();
  const createdAt = now.toISO() as string;
  const ttl = Math.floor(
    now
      .plus({
        day: 1,
      })
      .toSeconds(),
  );
  const id = uuid();
  const command = new PutCommand({
    Item: {
      __typename: 'Report',
      createdAt,
      data: `${owner}:${companyId}:${createdAt}`,
      downloadUrl,
      id,
      key,
      owner,
      ttl,
    },
    TableName: TABLE,
  });

  await client.send(command);

  const payload = {
    createdAt,
    downloadUrl,
    id,
    ttl,
  };

  return {
    owner,
    payload,
  };
});
