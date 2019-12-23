import { Handler } from 'aws-lambda';
import axios from 'axios';
import { object, string } from 'yup';

const schema = object().shape({
  email: string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
  name: string().required('Your name is required'),
  password: string().required('Password is required'),
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
      statusCode: 200,
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
