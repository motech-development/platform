import {
  apiGatewayHandler,
  paramCheck,
  response,
} from '@motech-development/api-gateway-handler';
import {
  allocateStagedFile,
  createSignedUrl,
} from '@motech-development/s3-file-operations';
import { captureException, init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { v4 as uuid } from 'uuid';
import { type InferType, object, string } from 'yup';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profileLifecycle: 'trace',
  profileSessionSampleRate: 1,
  tracesSampleRate: 1,
});

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

export const handler = wrapHandler(
  apiGatewayHandler(async (event) => {
    const { UPLOAD_BUCKET, DOWNLOAD_BUCKET, QUARANTINE_RETENTION_DAYS } =
      process.env;

    const bucket = paramCheck(UPLOAD_BUCKET, 'No bucket set', 400);
    const body = paramCheck(event.body, 'No body found', 400);
    let request: InferType<typeof schema>;

    try {
      request = await schema.validate(JSON.parse(body), {
        stripUnknown: true,
      });
    } catch {
      return response(
        {
          message: 'Invalid request',
          statusCode: 400,
        },
        400,
      );
    }

    const id = uuid();
    const { companyId, contentType, extension, metadata, owner } = request;
    const expirationInSeconds = 30;
    const key = `${owner}/${companyId}/${id}.${extension}`;
    const destination = paramCheck(
      DOWNLOAD_BUCKET,
      'No destination bucket set',
      400,
    );

    const retentionDays = Number(
      paramCheck(QUARANTINE_RETENTION_DAYS, 'No quarantine retention set', 400),
    );

    await allocateStagedFile(
      bucket,
      destination,
      key,
      expirationInSeconds,
      retentionDays,
    );

    const url = await createSignedUrl(
      'putObject',
      bucket,
      key,
      expirationInSeconds,
      {
        ContentType: contentType,
        Metadata: {
          'attachment-lifecycle': 'v1',
          ...(metadata.id
            ? {
                id: metadata.id,
              }
            : {}),
          typename: metadata.typename,
        },
      },
    );

    return response(
      {
        id,
        url,
      },
      200,
    );
  }, captureException),
);
