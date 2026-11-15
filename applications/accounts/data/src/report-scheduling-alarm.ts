import {
  captureException,
  flush,
  init,
  wrapHandler,
} from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type {
  CloudWatchAlarmEvent,
  CloudWatchAlarmMetric,
  Handler,
} from 'aws-lambda';

type ICloudWatchAlarmEvent = Pick<CloudWatchAlarmEvent, 'alarmArn'> & {
  alarmData: Pick<CloudWatchAlarmEvent['alarmData'], 'alarmName'> & {
    configuration: {
      metrics: Pick<CloudWatchAlarmMetric, 'metricStat'>[];
    };
    state: Pick<CloudWatchAlarmEvent['alarmData']['state'], 'reason' | 'value'>;
  };
};

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profileLifecycle: 'trace',
  profileSessionSampleRate: 1,
  tracesSampleRate: 1,
});

const alarmSignals = [
  {
    dimension: 'QueueName',
    suffix: '-dlq-messages-visible',
    tag: 'queue',
    title: 'failure',
  },
  {
    dimension: 'FunctionName',
    suffix: '-iterator-age',
    tag: 'function',
    title: 'stream lag',
  },
];

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
    const alarmPrefix = `accounts-${environment}-`;
    const { alarmName, configuration, state } = event.alarmData;

    const signal = alarmSignals.find(({ suffix }) =>
      alarmName.endsWith(suffix),
    );

    const failureBoundary =
      signal && alarmName.startsWith(alarmPrefix)
        ? alarmName.slice(alarmPrefix.length, -signal.suffix.length)
        : '';

    if (!signal || !failureBoundary) {
      throw new Error(`Unrecognised scheduling alarm: ${alarmName}`);
    }

    const [{ metricStat }] = configuration.metrics;

    const resource = {
      [signal.tag]: metricStat.metric.dimensions?.[signal.dimension],
    };

    captureException(new Error(`Accounts ${failureBoundary} ${signal.title}`), {
      contexts: {
        scheduling: {
          alarmArn: event.alarmArn,
          environment,
          ...resource,
          reason: state.reason,
        },
      },
      tags: {
        failureBoundary,
        ...resource,
      },
    });

    if (!(await flush(2000))) {
      throw new Error('Unable to flush the scheduling incident to Sentry');
    }
  },
);
