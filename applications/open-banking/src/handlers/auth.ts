import { APIGatewayEvent, Handler } from 'aws-lambda';
import { object, string } from 'yup';
import httpClient from '../shared/http-client';

const schema = object().shape({
  bank: string().required(),
  callback: string().required(),
  user: string().required(),
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

  const endpoint = '/account-auth-requests';

  try {
    const { data } = await httpClient.post(endpoint, {
      callback: body.callback,
      institutionId: body.bank,
      userUuid: body.user,
    });

    return {
      body: JSON.stringify({
        authorisationUrl: data.data.authorisationUrl,
      }),
      statusCode: 200,
    };
  } catch (e) {
    const { status } = e.response;

    return {
      body: JSON.stringify({
        message: 'Unable to authenticate',
        statusCode: status,
      }),
      statusCode: status,
    };
  }
};
