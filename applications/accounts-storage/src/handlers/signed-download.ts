import proxyHandler from '@motech-development/api-gateway-handler';
import { S3 } from 'aws-sdk';
import { join } from 'path';
import { object, string } from 'yup';

const s3 = new S3();
const schema = object().shape({
  owner: string().required(),
  path: string().required(),
});

export const handler = proxyHandler(async event => {
  const { DOWNLOAD_BUCKET } = process.env;

  if (!DOWNLOAD_BUCKET) {
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

    const { owner, path } = result;
    const expirationInSeconds = 30;

    const url = await s3.getSignedUrlPromise('getObject', {
      Bucket: DOWNLOAD_BUCKET,
      Expires: expirationInSeconds,
      Key: join(owner, path),
    });

    return {
      body: JSON.stringify({
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
