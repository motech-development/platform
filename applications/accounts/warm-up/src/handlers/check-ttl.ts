import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import logger from '@motech-development/node-logger';
import { AWSLambda } from '@sentry/serverless';
import { Handler } from 'aws-lambda';
import { boolean, number, object, string } from 'yup';

AWSLambda.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

const client = new DynamoDBClient({});

const schema = object({
  attempts: number().default(0).required(),
  complete: boolean().optional(),
  id: string().required(),
}).required();

export interface IEvent {
  attempts?: number;
  complete?: boolean;
  id: string;
}

export const handler: Handler<IEvent> = AWSLambda.wrapHandler(async (event) => {
  const { TABLE } = process.env;

  if (!TABLE) {
    throw new Error('No table set');
  }

  const { attempts, id } = await schema.validate(event, {
    abortEarly: true,
    stripUnknown: true,
  });

  const command = new GetCommand({
    Key: {
      __typename: 'WarmUp',
      id,
    },
    TableName: TABLE,
  });

  const { Item } = await client.send(command);

  logger.debug('Result from database', {
    Item,
    attempts,
  });

  const complete = !Item;

  logger.info(
    complete
      ? 'No item found, polling complete'
      : 'Item found, sleeping for 3 minutes',
  );

  return {
    attempts: attempts + 1,
    complete,
    id,
  };
});
