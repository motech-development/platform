import { APIGatewayEvent, Handler } from 'aws-lambda';
import { object, string } from 'yup';
import httpClient from '../shared/http-client';

const schema = object().shape({
  id: string().required(),
});

export const post: Handler<APIGatewayEvent> = async event => {
  if (!event.body) {
    throw new Error('No body set');
  }

  const body = JSON.parse(event.body);

  try {
    await schema.validate(body, {
      stripUnknown: true,
    });
  } catch (e) {
    return {
      body: JSON.stringify({
        message: e.message,
        statusCode: 400,
      }),
      statusCode: 400,
    };
  }

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
};
