import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import {
  apiGatewayHandler,
  paramCheck,
  response,
} from '@motech-development/api-gateway-handler';
import { captureException, init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';
import { type InferType, object, string } from 'yup';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profileLifecycle: 'trace',
  profileSessionSampleRate: 1,
  tracesSampleRate: 1,
});

const client = new DynamoDBClient({});
const schema = object({
  message: string().required(),
  owner: string().required(),
  payload: string().optional(),
}).required();

export const handler = wrapHandler(
  apiGatewayHandler(async (event) => {
    const { TABLE } = process.env;
    const TableName = paramCheck(TABLE, 'No table set', 400);
    const body = paramCheck(event.body, 'No body found', 400);
    const createdAt = DateTime.utc().toISO();
    let request: InferType<typeof schema>;

    try {
      request = await schema.validate(JSON.parse(body), {
        stripUnknown: true,
      });
    } catch {
      return response(
        {
          message: 'Invalid request',
          statusCode: 400,
        },
        400,
      );
    }

    const { message, owner, payload } = request;
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
  }, captureException),
);
