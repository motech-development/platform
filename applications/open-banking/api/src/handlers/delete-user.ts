import {
  apiGatewayHandler,
  paramCheck,
  response,
} from '@motech-development/api-gateway-handler';
import httpClient, { getErrorStatus } from '../shared/http-client';

export const handler = apiGatewayHandler(async (event) => {
  const pathParameters = paramCheck(event.pathParameters, 'No params set', 400);
  const userId = paramCheck(pathParameters.userId, 'No user id', 400);
  const endpoint = `/users/${userId}`;

  try {
    await httpClient.delete(endpoint);

    return response('', 204);
  } catch (e) {
    const status = getErrorStatus(e);

    return response(
      {
        message: 'Unable to delete user',
        statusCode: status,
      },
      status,
    );
  }
});
