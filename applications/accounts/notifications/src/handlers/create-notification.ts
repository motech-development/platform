import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import {
  apiGatewayHandler,
  paramCheck,
  response,
} from '@motech-development/api-gateway-handler';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';
import { object, string } from 'yup';

const client = new DynamoDBClient({});
const schema = object({
  message: string().required(),
  owner: string().required(),
  payload: string().optional(),
}).required();

export const handler = apiGatewayHandler(async (event) => {
  const { TABLE } = process.env;
  const TableName = paramCheck(TABLE, 'No table set', 400);
  const body = paramCheck(event.body, 'No body found', 400);
  const bodyParams = JSON.parse(body) as unknown;
  const createdAt = DateTime.utc().toISO();

  try {
    const { message, owner, payload } = await schema.validate(bodyParams, {
      stripUnknown: true,
    });

    const command = new PutCommand({
      Item: {
        __typename: 'Notification',
        createdAt,
        data: `${owner}:Notification:${createdAt}`,
        id: uuid(),
        message,
        owner,
        payload,
        read: false,
      },
      TableName,
    });

    await client.send(command);

    return response('', 201);
  } catch {
    return response(
      {
        message: 'Invalid request',
        statusCode: 400,
      },
      400,
    );
  }
});
