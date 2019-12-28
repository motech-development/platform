import { forgottenPassword } from '@motech-development/schema';
import { Handler } from 'aws-lambda';
import axios from 'axios';

const { AUTH0_DOMAIN, CLIENT_ID } = process.env;

export const post: Handler = async event => {
  const body = JSON.parse(event.body);

  try {
    await forgottenPassword.validate(body);
  } catch (e) {
    return {
      body: JSON.stringify({
        message: e.message,
      }),
      statusCode: 400,
    };
  }

  const { data } = await axios.post(
    `https://${AUTH0_DOMAIN}/dbconnections/change_password`,
    {
      // eslint-disable-next-line @typescript-eslint/camelcase
      client_id: CLIENT_ID,
      connection: 'Username-Password-Authentication',
      ...body,
    },
  );

  return {
    body: JSON.stringify({
      message: data,
    }),
    statusCode: 200,
  };
};
