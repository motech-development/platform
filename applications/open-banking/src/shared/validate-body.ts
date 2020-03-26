import { ObjectSchema, Shape } from 'yup';

async function validateBody<T extends object>(
  schema: ObjectSchema<Shape<object, T>>,
  eventBody: string | null,
) {
  if (!eventBody) {
    const response = {
      body: JSON.stringify({
        message: 'No body set',
        statusCode: 400,
      }),
      statusCode: 400,
    };

    throw response;
  }

  try {
    const body = JSON.parse(eventBody);

    await schema.validate(body, {
      stripUnknown: true,
    });

    return body;
  } catch (e) {
    const response = {
      body: JSON.stringify({
        message: e.message,
        statusCode: 400,
      }),
      statusCode: 400,
    };

    throw response;
  }
}

export default validateBody;
