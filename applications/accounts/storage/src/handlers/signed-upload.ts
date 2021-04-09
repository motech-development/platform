import {
  apiGatewayHandler,
  paramCheck,
  response,
} from '@motech-development/api-gateway-handler';
import { createSignedUrl } from '@motech-development/s3-file-operations';
import { v4 as uuid } from 'uuid';
import { object, string } from 'yup';

const whitelist = ['gif', 'jpeg', 'jpg', 'pdf', 'png'];
const schema = object()
  .shape({
    companyId: string().required(),
    contentType: string().required(),
    extension: string().lowercase().oneOf(whitelist).required(),
    metadata: object()
      .shape({
        id: string().nullable(),
        typename: string().required(),
      })
      .required(),
    owner: string().required(),
  })
  .required();

export const handler = apiGatewayHandler(async (event) => {
  const { UPLOAD_BUCKET } = process.env;
  const bucket = paramCheck(UPLOAD_BUCKET, 'No bucket set', 400);
  const body = paramCheck(event.body, 'No body found', 400);
  const bodyParams = JSON.parse(body);

  try {
    const result = await schema.validate(bodyParams, {
      stripUnknown: true,
    });
    const id = uuid();
    const { companyId, contentType, extension, metadata, owner } = result;
    const expirationInSeconds = 30;

    const url = await createSignedUrl('putObject', {
      Bucket: bucket,
      ContentType: contentType,
      Expires: expirationInSeconds,
      Key: `${owner}/${companyId}/${id}.${extension}`,
      Metadata: {
        ...(metadata.id
          ? {
              id: metadata.id,
            }
          : {}),
        typename: metadata.typename,
      },
    });

    return response(
      {
        id,
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
