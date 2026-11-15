import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';
import { captureException } from '@sentry/aws-serverless';
import type { Context, SQSEvent } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import type { Mock } from 'vitest';
import { handler } from '../start-scan';

vi.mock('@sentry/aws-serverless', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@sentry/aws-serverless')>()),
  captureException: vi.fn(),
}));

describe('start-scan', () => {
  let callback: Mock;
  let context: Context;
  let event: SQSEvent;
  let sfn: AwsClientStub<SFNClient>;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = vi.fn();

    event = {
      Records: [
        {
          messageAttributes: {
            from: {
              dataType: 'string',
              stringValue: 'upload-bucket',
            },
            key: {
              dataType: 'string',
              stringValue: 'file-1.pdf',
            },
            to: {
              dataType: 'string',
              stringValue: 'download-bucket',
            },
          },
          messageId: 'message-1',
        },
        {
          messageAttributes: {
            from: {
              dataType: 'string',
              stringValue: 'upload-bucket',
            },
            key: {
              dataType: 'string',
              stringValue: 'file-2.pdf',
            },
            to: {
              dataType: 'string',
              stringValue: 'download-bucket',
            },
          },
          messageId: 'message-2',
        },
      ],
    } as unknown as SQSEvent;

    sfn = mockClient(SFNClient);
  });

  it('should throw an error if state machine is not set', async () => {
    await expect(handler(event, context, callback)).rejects.toThrow(
      'No state machine set',
    );
  });

  describe('when a state machine is set', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.STATE_MACHINE_ARN = 'state-machine-arn';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should start the correct number of executions', async () => {
      await handler(event, context, callback);

      expect(sfn).toReceiveCommandTimes(StartExecutionCommand, 2);
    });

    it('should start executions with the correct params', async () => {
      await handler(event, context, callback);

      expect(sfn).toReceiveCommandWith(StartExecutionCommand, {
        input: JSON.stringify({
          from: 'upload-bucket',
          key: 'file-1.pdf',
          to: 'download-bucket',
        }),
        stateMachineArn: 'state-machine-arn',
      });

      expect(sfn).toReceiveCommandWith(StartExecutionCommand, {
        input: JSON.stringify({
          from: 'upload-bucket',
          key: 'file-2.pdf',
          to: 'download-bucket',
        }),
        stateMachineArn: 'state-machine-arn',
      });
    });

    it('should report a failed execution without failing the others', async () => {
      const error = new Error('Execution failed');

      sfn.on(StartExecutionCommand).rejectsOnce(error).resolves({});

      await expect(handler(event, context, callback)).resolves.toEqual({
        batchItemFailures: [
          {
            itemIdentifier: 'message-1',
          },
        ],
      });

      expect(sfn).toReceiveCommandTimes(StartExecutionCommand, 2);
      expect(captureException).toHaveBeenCalledWith(error);
    });
  });
});
