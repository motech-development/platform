import proxyHandler from '@motech-development/api-gateway-handler';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { object, string } from 'yup';

const whitelist = ['gif', 'jpeg', 'jpg', 'pdf', 'png'];
const s3 = new S3();
const schema = object().shape({
  extension: string()
    .oneOf(whitelist)
    .required(),
  owner: string().required(),
});

export const handler = proxyHandler(async event => {
  const { BUCKET } = process.env;

  if (!BUCKET) {
    const response = {
      body: JSON.stringify({
        message: 'No bucket set',
        statusCode: 400,
      }),
      statusCode: 400,
    };

    throw response;
  }

  if (!event.body) {
    const response = {
      body: JSON.stringify({
        message: 'No body found',
        statusCode: 400,
      }),
      statusCode: 400,
    };

    throw response;
  }

  const body = JSON.parse(event.body);

  try {
    const result = await schema.validate(body, {
      stripUnknown: true,
    });
    const id = uuid();
    const { extension, owner } = result;
    const expirationInSeconds = 30;

    const url = await s3.getSignedUrlPromise('putObject', {
      Bucket: BUCKET,
      ContentType: 'multipart/form-data',
      Expires: expirationInSeconds,
      Key: `${owner}/${id}.${extension}`,
    });

    return {
      body: JSON.stringify({
        id,
        url,
      }),
      statusCode: 200,
    };
  } catch (e) {
    const response = {
      body: JSON.stringify({
        message: 'Invalid request',
        statusCode: 400,
      }),
      statusCode: 400,
    };

    throw response;
  }
});
