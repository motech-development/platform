import { ProfilingIntegration } from '@sentry/profiling-node';
import { AWSLambda } from '@sentry/serverless';
import { Handler } from 'aws-lambda';
import getBalance from './handlers/get-balance';
import { ITransformedBalance } from './shared/transform-balance';

AWSLambda.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new ProfilingIntegration()],
  profilesSampleRate: 1.0,
  tracesSampleRate: 1.0,
});

export interface IEvent {
  args: {
    id: string;
    owner: string;
  };
  field: string;
}

export const handler: Handler<IEvent, ITransformedBalance> =
  AWSLambda.wrapHandler(async (event) => {
    const { args, field } = event;

    if (field === 'getBalance') {
      return getBalance(args);
    }

    throw new Error('Unrecognised field');
  });
