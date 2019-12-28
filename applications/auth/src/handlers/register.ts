import { register } from '@motech-development/schema';
import { Handler } from 'aws-lambda';
import axios from 'axios';

const { AUTH0_DOMAIN, CLIENT_ID } = process.env;

export const post: Handler = async event => {
  const body = JSON.parse(event.body);

  try {
    await register.validate(body);
  } catch (e) {
    return {
      body: JSON.stringify({
        message: e.message,
      }),
      statusCode: 400,
    };
  }

  try {
    const { data } = await axios.post(
      `https://${AUTH0_DOMAIN}/dbconnections/signup`,
      {
        // eslint-disable-next-line @typescript-eslint/camelcase
        client_id: CLIENT_ID,
        connection: 'Username-Password-Authentication',
        ...body,
      },
    );

    return {
      body: JSON.stringify(data),
      statusCode: 201,
    };
  } catch (e) {
    const { data } = e.response;

    return {
      body: JSON.stringify({
        message: data.description,
      }),
      statusCode: data.statusCode,
    };
  }
};
