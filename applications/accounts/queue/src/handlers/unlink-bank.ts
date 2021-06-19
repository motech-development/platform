import aws4 from 'aws4';
import { Handler } from 'aws-lambda';
import axios from 'axios';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const documentClient = new DocumentClient();

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
    const host = ENDPOINT.replace('https://', '');
    const path = `/${STAGE}/api/v1/users/${user}`;
    const url = ENDPOINT + path;

    const opts = {
      host,
      method: 'DELETE',
      path,
      url,
    };

    const request = aws4.sign(opts);

    delete request.headers.Host;
    delete request.headers['Content-Length'];

    await axios(request);
  }

  return {
    ...event,
  };
};
