import { APIGatewayEvent, Handler } from 'aws-lambda';
import httpClient from '../shared/http-client';
import proxyHandler from '../shared/proxy-handler';

export const handler: Handler<APIGatewayEvent> = proxyHandler(async event => {
  const { pathParameters } = event;

  if (!pathParameters) {
    const response = {
      body: JSON.stringify({
        message: 'No params set',
        statusCode: 400,
      }),
      statusCode: 400,
    };

    throw response;
  }

  const { userId } = pathParameters;

  if (!userId) {
    const response = {
      body: JSON.stringify({
        message: 'No user id',
        statusCode: 400,
      }),
      statusCode: 400,
    };

    throw response;
  }

  const endpoint = `/users/${userId}`;

  try {
    await httpClient.delete(endpoint);

    return {
      statusCode: 204,
    };
  } catch (e) {
    const { status } = e.response;

    return {
      body: JSON.stringify({
        message: 'Unable to delete user',
        statusCode: status,
      }),
      statusCode: status,
    };
  }
});
