import { join } from 'node:path';
import {
  apiGatewayHandler,
  paramCheck,
  response,
} from '@motech-development/api-gateway-handler';
import { createSignedUrl } from '@motech-development/s3-file-operations';
import { captureException, init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { type InferType, object, string } from 'yup';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profileLifecycle: 'trace',
  profileSessionSampleRate: 1,
  tracesSampleRate: 1,
});

const schema = object()
  .shape({
    owner: string().required(),
    path: string().required(),
  })
  .required();

export const handler = wrapHandler(
  apiGatewayHandler(async (event) => {
    const { DOWNLOAD_BUCKET } = process.env;
    const bucket = paramCheck(DOWNLOAD_BUCKET, 'No bucket set', 400);
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

    const { owner, path } = request;
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
  }, captureException),
);
