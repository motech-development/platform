import {
  apiGatewayHandler,
  paramCheck,
  response,
} from '@motech-development/api-gateway-handler';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';
import { object, string } from 'yup';

const client = new DocumentClient();
const schema = object({
  message: string().required(),
  owner: string().required(),
}).required();

export const handler = apiGatewayHandler(async (event) => {
  const { TABLE } = process.env;
  const TableName = paramCheck(TABLE, 'No table set', 400);
  const body = paramCheck(event.body, 'No body found', 400);
  const bodyParams = JSON.parse(body);
  const createdAt = DateTime.utc().toISO();

  try {
    const { message, owner } = await schema.validate(bodyParams, {
      stripUnknown: true,
    });

    await client
      .put({
        Item: {
          __typename: 'Notification',
          createdAt,
          data: `${owner}:Notification:${createdAt}`,
          id: uuid(),
          message,
          owner,
          read: false,
        },
        TableName,
      })
      .promise();

    return response('', 201);
  } catch (e) {
    return response(
      {
        message: 'Invalid request',
        statusCode: 400,
      },
      400,
    );
  }
});
