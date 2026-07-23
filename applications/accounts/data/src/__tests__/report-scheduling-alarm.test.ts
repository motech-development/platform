import { captureException, flush } from '@sentry/aws-serverless';
import type { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { handler } from '../report-scheduling-alarm';

jest.mock('@sentry/aws-serverless', () => ({
  captureException: jest.fn(),
  flush: jest.fn().mockResolvedValue(true),
  init: jest.fn(),
  wrapHandler: (wrappedHandler: unknown) => wrappedHandler,
}));

jest.mock('@sentry/profiling-node', () => ({
  nodeProfilingIntegration: jest.fn(),
}));

const alarmEvent = {
  accountId: '123456789012',
  alarmArn:
    'arn:aws:cloudwatch:eu-west-1:123456789012:alarm:accounts-test-schedule-synchronisation-dlq-messages-visible',
  alarmData: {
    alarmName: 'accounts-test-schedule-synchronisation-dlq-messages-visible',
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
  let callback: jest.Mock;
  let context: Context;
  let originalEnvironment: NodeJS.ProcessEnv;

  beforeEach(() => {
    jest.clearAllMocks();
    callback = jest.fn();
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
        message: 'Scheduled Transaction schedule-synchronisation failure',
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
    jest.mocked(flush).mockResolvedValueOnce(false);

    await expect(handler(alarmEvent, context, callback)).rejects.toThrow(
      'Unable to flush the scheduling incident to Sentry',
    );
  });

  it.each(['scheduler-delivery', 'publication-processing'])(
    'reports the %s boundary independently',
    async (failureBoundary) => {
      const alarmName = `accounts-test-${failureBoundary}-dlq-messages-visible`;

      await handler(
        {
          ...alarmEvent,
          alarmArn: `arn:aws:cloudwatch:eu-west-1:123456789012:alarm:${alarmName}`,
          alarmData: {
            ...alarmEvent.alarmData,
            alarmName,
          },
        },
        context,
        callback,
      );

      expect(captureException).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          tags: {
            failureBoundary,
            queue: `accounts-test-${failureBoundary}-dlq`,
          },
        }),
      );
    },
  );
});
