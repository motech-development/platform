import { Handler } from 'aws-lambda';
import axios from 'axios';
import { object, string } from 'yup';

const schema = object().shape({
  password: string().required('Password is required'),
  username: string().required('Email address is required'),
});

const { AUTH0_DOMAIN, CLIENT_ID } = process.env;

export const post: Handler = async event => {
  const body = JSON.parse(event.body);

  try {
    await schema.validate(body);
  } catch (e) {
    return {
      body: JSON.stringify({
        message: e.message,
      }),
      statusCode: 400,
    };
  }

  try {
    const { data } = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
      // eslint-disable-next-line @typescript-eslint/camelcase
      client_id: CLIENT_ID,
      // eslint-disable-next-line @typescript-eslint/camelcase
      grant_type: 'http://auth0.com/oauth/grant-type/password-realm',
      realm: 'Username-Password-Authentication',
      scope: 'openid',
      ...body,
    });

    return {
      body: JSON.stringify(data),
      statusCode: 200,
    };
  } catch (e) {
    const { data, status } = e.response;

    return {
      body: JSON.stringify({
        message: data.error_description,
      }),
      statusCode: status,
    };
  }
};
