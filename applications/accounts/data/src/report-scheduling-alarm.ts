import {
  captureException,
  flush,
  init,
  wrapHandler,
} from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type { Handler } from 'aws-lambda';

interface ICloudWatchAlarmEvent {
  alarmArn: string;
  alarmData: {
    alarmName: string;
    state: {
      reason: string;
      value: string;
    };
  };
}

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profileLifecycle: 'trace',
  profileSessionSampleRate: 1,
  tracesSampleRate: 1,
});

const alarmSuffix = '-messages-visible';
const dlqSuffix = '-dlq';

const requiredEnvironment = (): string => {
  const environment = process.env.SENTRY_ENVIRONMENT;

  if (!environment) {
    throw new Error('No Sentry environment set');
  }

  return environment;
};

export const handler: Handler<ICloudWatchAlarmEvent> = wrapHandler(
  async (event) => {
    const environment = requiredEnvironment();
    const queuePrefix = `accounts-${environment}-`;
    const { alarmName, state } = event.alarmData;

    if (
      !alarmName.startsWith(queuePrefix) ||
      !alarmName.endsWith(`${dlqSuffix}${alarmSuffix}`)
    ) {
      throw new Error(`Unrecognised scheduling alarm: ${alarmName}`);
    }

    const queue = alarmName.slice(0, -alarmSuffix.length);
    const failureBoundary = queue.slice(queuePrefix.length, -dlqSuffix.length);

    captureException(
      new Error(`Scheduled Transaction ${failureBoundary} failure`),
      {
        contexts: {
          scheduling: {
            alarmArn: event.alarmArn,
            environment,
            queue,
            reason: state.reason,
          },
        },
        tags: {
          failureBoundary,
          queue,
        },
      },
    );

    if (!(await flush(2000))) {
      throw new Error('Unable to flush the scheduling incident to Sentry');
    }
  },
);
