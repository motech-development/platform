import logger from '@motech-development/node-logger';
import { Handler } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { boolean, number, object, string } from 'yup';

const client = new DocumentClient();

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

export const handler: Handler<IEvent> = async (event) => {
  const { TABLE } = process.env;

  if (!TABLE) {
    throw new Error('No table set');
  }

  const { attempts, id } = await schema.validate(event, {
    abortEarly: true,
    stripUnknown: true,
  });

  const { Item } = await client
    .get({
      Key: {
        __typename: 'WarmUp',
        id,
      },
      TableName: TABLE,
    })
    .promise();

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
};
