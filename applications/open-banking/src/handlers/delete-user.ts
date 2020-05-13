import proxyHandler from '@motech-development/api-gateway-handler';
import httpClient from '../shared/http-client';

export const handler = proxyHandler(async event => {
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
      body: '',
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
