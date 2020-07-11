import {
  apiGatewayHandler,
  paramCheck,
  response,
} from '@motech-development/api-gateway-handler';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { object, string } from 'yup';

const whitelist = ['gif', 'jpeg', 'jpg', 'pdf', 'png'];
const s3 = new S3();
const schema = object()
  .shape({
    companyId: string().required(),
    contentType: string().required(),
    extension: string()
      .lowercase()
      .oneOf(whitelist)
      .required(),
    metadata: object()
      .shape({
        id: string().nullable(),
        typename: string().required(),
      })
      .required(),
    owner: string().required(),
  })
  .required();

export const handler = apiGatewayHandler(async event => {
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

    const url = await s3.getSignedUrlPromise('putObject', {
      Bucket: bucket,
      ContentType: contentType,
      Expires: expirationInSeconds,
      Key: `${owner}/${companyId}/${id}.${extension}`,
      Metadata: metadata,
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
