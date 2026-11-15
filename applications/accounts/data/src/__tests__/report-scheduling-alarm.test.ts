import { captureException, flush } from '@sentry/aws-serverless';
import type { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import type { Mock } from 'vitest';
import { handler } from '../report-scheduling-alarm';

vi.mock('@sentry/aws-serverless', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@sentry/aws-serverless')>();

  return {
    ...actual,
    captureException: vi.fn(),
    flush: vi.fn().mockResolvedValue(true),
    init: vi.fn(),
    wrapHandler: (wrappedHandler: unknown) => wrappedHandler,
  };
});

vi.mock('@sentry/profiling-node', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@sentry/profiling-node')>();

  return {
    ...actual,
    nodeProfilingIntegration: vi.fn(),
  };
});

const alarmEvent = {
  accountId: '123456789012',
  alarmArn:
    'arn:aws:cloudwatch:eu-west-1:123456789012:alarm:accounts-test-schedule-synchronisation-dlq-messages-visible',
  alarmData: {
    alarmName: 'accounts-test-schedule-synchronisation-dlq-messages-visible',
    configuration: {
      metrics: [
        {
          id: 'messages',
          metricStat: {
            metric: {
              dimensions: {
                QueueName: 'accounts-test-schedule-synchronisation-dlq',
              },
              name: 'ApproximateNumberOfMessagesVisible',
              namespace: 'AWS/SQS',
            },
            period: 60,
            stat: 'Maximum',
          },
          returnData: true,
        },
      ],
    },
    state: {
      reason: 'Threshold crossed',
      timestamp: '2020-06-06T19:45:00.000Z',
      value: 'ALARM',
    },
  },
  region: 'eu-west-1',
  source: 'aws.cloudwatch',
  time: '2020-06-06T19:45:00.000Z',
};

describe('report-scheduling-alarm', () => {
  let callback: Mock;
  let context: Context;
  let originalEnvironment: NodeJS.ProcessEnv;

  beforeEach(() => {
    vi.clearAllMocks();
    callback = vi.fn();
    context = ctx();
    context.done();
    originalEnvironment = process.env;
    process.env = {
      ...process.env,
      SENTRY_ENVIRONMENT: 'test',
    };
  });

  afterEach(() => {
    process.env = originalEnvironment;
  });

  it('reports the failure boundary and retains the DLQ message', async () => {
    await handler(alarmEvent, context, callback);

    expect(captureException).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Accounts schedule-synchronisation failure',
      }),
      {
        contexts: {
          scheduling: {
            alarmArn: alarmEvent.alarmArn,
            environment: 'test',
            queue: 'accounts-test-schedule-synchronisation-dlq',
            reason: 'Threshold crossed',
          },
        },
        tags: {
          failureBoundary: 'schedule-synchronisation',
          queue: 'accounts-test-schedule-synchronisation-dlq',
        },
      },
    );
    expect(flush).toHaveBeenCalledWith(2000);
  });

  it('propagates a failed Sentry flush so CloudWatch can retry', async () => {
    vi.mocked(flush).mockResolvedValueOnce(false);

    await expect(handler(alarmEvent, context, callback)).rejects.toThrow(
      'Unable to flush the scheduling incident to Sentry',
    );
  });

  it.each([
    ['scheduler-delivery', 'accounts-test-scheduler-delivery-dlq'],
    ['publication-processing', 'accounts-test-publication-processing-dlq'],
    ['stream-processing', 'accounts-test-stream-processing-dlq'],
    ['company-deletion', 'accounts-test-dlq'],
    ['delete-file', 'accounts-test-delete-file-dlq'],
    ['anti-virus', 'anti-virus-test-dlq'],
    ['anti-virus-failure', 'anti-virus-test-failure-dlq'],
  ])(
    'reports the %s boundary with its queue',
    async (failureBoundary, queue) => {
      const alarmName = `accounts-test-${failureBoundary}-dlq-messages-visible`;

      await handler(
        {
          ...alarmEvent,
          alarmArn: `arn:aws:cloudwatch:eu-west-1:123456789012:alarm:${alarmName}`,
          alarmData: {
            ...alarmEvent.alarmData,
            alarmName,
            configuration: {
              metrics: [
                {
                  metricStat: {
                    ...alarmEvent.alarmData.configuration.metrics[0].metricStat,
                    metric: {
                      ...alarmEvent.alarmData.configuration.metrics[0]
                        .metricStat.metric,
                      dimensions: {
                        QueueName: queue,
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        context,
        callback,
      );

      expect(captureException).toHaveBeenCalledWith(
        expect.objectContaining({
          message: `Accounts ${failureBoundary} failure`,
        }),
        expect.objectContaining({
          tags: {
            failureBoundary,
            queue,
          },
        }),
      );
    },
  );

  it('reports a lagging stream consumer with its function', async () => {
    const alarmName = 'accounts-test-transactions-iterator-age';

    await handler(
      {
        ...alarmEvent,
        alarmArn: `arn:aws:cloudwatch:eu-west-1:123456789012:alarm:${alarmName}`,
        alarmData: {
          ...alarmEvent.alarmData,
          alarmName,
          configuration: {
            metrics: [
              {
                metricStat: {
                  metric: {
                    dimensions: {
                      FunctionName: 'accounts-data-test-Transactions',
                    },
                    name: 'IteratorAge',
                    namespace: 'AWS/Lambda',
                  },
                  period: 60,
                  stat: 'Maximum',
                },
              },
            ],
          },
        },
      },
      context,
      callback,
    );

    expect(captureException).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Accounts transactions stream lag',
      }),
      {
        contexts: {
          scheduling: {
            alarmArn: `arn:aws:cloudwatch:eu-west-1:123456789012:alarm:${alarmName}`,
            environment: 'test',
            function: 'accounts-data-test-Transactions',
            reason: 'Threshold crossed',
          },
        },
        tags: {
          failureBoundary: 'transactions',
          function: 'accounts-data-test-Transactions',
        },
      },
    );
  });

  it.each([
    'accounts-test-dlq-messages-visible',
    'accounts-test-transactions-errors',
    'accounts-other-transactions-iterator-age',
    'anti-virus-test-dlq-messages-visible',
  ])('rejects the unrecognised alarm %s', async (alarmName) => {
    await expect(
      handler(
        {
          ...alarmEvent,
          alarmData: {
            ...alarmEvent.alarmData,
            alarmName,
          },
        },
        context,
        callback,
      ),
    ).rejects.toThrow(`Unrecognised scheduling alarm: ${alarmName}`);

    expect(captureException).not.toHaveBeenCalled();
  });
});
