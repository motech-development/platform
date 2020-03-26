import { APIGatewayEvent, Handler } from 'aws-lambda';
import { object, string } from 'yup';
import httpClient from '../shared/http-client';
import proxyHandler from '../shared/proxy-handler';
import validateBody from '../shared/validate-body';

const schema = object().shape({
  id: string().required(),
});

export const post: Handler<APIGatewayEvent> = proxyHandler(async event => {
  const body = await validateBody(schema, event.body);
  const endpoint = '/users';

  try {
    const { data } = await httpClient.post(endpoint, {
      applicationUserId: body.id,
    });

    return {
      body: JSON.stringify({
        id: data.uuid,
      }),
      statusCode: 201,
    };
  } catch (e) {
    const { status } = e.response;

    return {
      body: JSON.stringify({
        message: 'Unable to create user',
        statusCode: status,
      }),
      statusCode: status,
    };
  }
});
