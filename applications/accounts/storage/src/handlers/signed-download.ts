import {
  apiGatewayHandler,
  paramCheck,
  response,
} from '@motech-development/api-gateway-handler';
import { createSignedUrl } from '@motech-development/s3-file-operations';
import { join } from 'path';
import { object, string } from 'yup';

const schema = object()
  .shape({
    owner: string().required(),
    path: string().required(),
  })
  .required();

export const handler = apiGatewayHandler(async (event) => {
  const { DOWNLOAD_BUCKET } = process.env;
  const bucket = paramCheck(DOWNLOAD_BUCKET, 'No bucket set', 400);
  const body = paramCheck(event.body, 'No body found', 400);
  const bodyParams = JSON.parse(body) as unknown;

  try {
    const result = await schema.validate(bodyParams, {
      stripUnknown: true,
    });

    const { owner, path } = result;
    const expirationInSeconds = 30;
    const key = join(owner, path);
    const url = await createSignedUrl(
      'getObject',
      bucket,
      key,
      expirationInSeconds,
    );

    return response(
      {
        url,
      },
      200,
    );
  } catch (e) {
    return response(
      {
        message: 'Invalid request',
        statusCode: 400,
      },
      400,
    );
  }
});
