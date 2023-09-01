import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { NativeAttributeValue } from '@aws-sdk/util-dynamodb';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { AWSLambda } from '@sentry/serverless';
import { aws4Interceptor } from 'aws4-axios';
import { Handler } from 'aws-lambda';
import axios from 'axios';

AWSLambda.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new ProfilingIntegration()],
  profilesSampleRate: 1.0,
  tracesSampleRate: 1.0,
});

interface IItem {
  user: string;
}

const documentClient = new DynamoDBClient({});

const instance = axios.create();

const interceptor = aws4Interceptor({});

instance.interceptors.request.use(interceptor);

const isUser = (item?: Record<string, NativeAttributeValue>): item is IItem =>
  !!item?.user;

export interface IEvent {
  id: string;
  owner: string;
}

export const handler: Handler<IEvent> = AWSLambda.wrapHandler(async (event) => {
  const { ENDPOINT, STAGE, TABLE } = process.env;

  if (!TABLE) {
    throw new Error('No table set');
  }

  if (!ENDPOINT) {
    throw new Error('No endpoint set');
  }

  if (!STAGE) {
    throw new Error('No stage set');
  }

  const { id } = event;

  const command = new GetCommand({
    ExpressionAttributeNames: {
      '#user': 'user',
    },
    Key: {
      __typename: 'BankSettings',
      id,
    },
    ProjectionExpression: '#user',
    TableName: TABLE,
  });

  const { Item } = await documentClient.send(command);

  if (isUser(Item)) {
    const { user } = Item;
    const path = `/${STAGE}/api/v1/users/${user}`;
    const url = ENDPOINT + path;

    await instance.request({
      method: 'DELETE',
      url,
    });
  }

  return {
    ...event,
  };
});
