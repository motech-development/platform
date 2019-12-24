import { Handler } from 'aws-lambda';
import axios from 'axios';
import { object, ref, string } from 'yup';

const schema = object().shape({
  confirmPassword: string()
    .oneOf([ref('password'), null], 'Passwords to not match')
    .required('Please confirm your password'),
  email: string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
  // eslint-disable-next-line @typescript-eslint/camelcase
  family_name: string().required('Your surname is required'),
  // eslint-disable-next-line @typescript-eslint/camelcase
  given_name: string().required('Your forename is required'),
  password: string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[a-z]/, 'Password must contain at least one lowercase character')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase character')
    .matches(
      /[^a-zA-Z\s]+/,
      'Password must contain at least 1 number or special character (!@#$%^&*)',
    )
    .required('Password is required'),
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
