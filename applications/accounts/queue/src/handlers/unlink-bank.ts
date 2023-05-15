import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { NativeAttributeValue } from '@aws-sdk/util-dynamodb';
import { aws4Interceptor } from 'aws4-axios';
import { Handler } from 'aws-lambda';
import axios from 'axios';

interface IItem {
  user: string;
}

const documentClient = new DynamoDBClient({});

const instance = axios.create();

const interceptor = aws4Interceptor({
  instance,
});

instance.interceptors.request.use(interceptor);

const isUser = (item?: Record<string, NativeAttributeValue>): item is IItem =>
  !!item?.user;

export interface IEvent {
  id: string;
  owner: string;
}

export const handler: Handler<IEvent> = async (event) => {
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
};
