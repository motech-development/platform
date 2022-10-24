import { aws4Interceptor } from 'aws4-axios';
import { Handler } from 'aws-lambda';
import axios from 'axios';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const documentClient = new DocumentClient();

const axiosClient = axios.create();

const interceptor = aws4Interceptor();

axiosClient.interceptors.request.use(interceptor);

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

  const { Item } = await documentClient
    .get({
      ExpressionAttributeNames: {
        '#user': 'user',
      },
      Key: {
        __typename: 'BankSettings',
        id,
      },
      ProjectionExpression: '#user',
      TableName: TABLE,
    })
    .promise();

  if (Item?.user) {
    const { user } = Item;
    const path = `/${STAGE}/api/v1/users/${user}`;
    const url = ENDPOINT + path;

    await axiosClient.request({
      method: 'DELETE',
      url,
    });
  }

  return {
    ...event,
  };
};
