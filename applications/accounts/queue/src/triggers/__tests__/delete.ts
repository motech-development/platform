import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';
import { captureException } from '@sentry/aws-serverless';
import type { Context, SQSEvent } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import type { Mock } from 'vitest';
import { handler } from '../delete';

vi.mock('@sentry/aws-serverless', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@sentry/aws-serverless')>()),
  captureException: vi.fn(),
}));

describe('delete', () => {
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
          attributes: {
            ApproximateFirstReceiveTimestamp: '',
            ApproximateReceiveCount: '',
            SenderId: '',
            SentTimestamp: '',
          },
          awsRegion: '',
          body: '',
          eventSource: '',
          eventSourceARN: '',
          md5OfBody: '',
          messageAttributes: {
            id: {
              binaryListValues: [],
              binaryValue: '',
              dataType: 'string',
              stringListValues: [],
              stringValue: 'company-1-id',
            },
            owner: {
              binaryListValues: [],
              binaryValue: '',
              dataType: 'string',
              stringListValues: [],
              stringValue: 'owner-id',
            },
          },
          messageId: 'message-1',
          receiptHandle: '',
        },
        {
          attributes: {
            ApproximateFirstReceiveTimestamp: '',
            ApproximateReceiveCount: '',
            SenderId: '',
            SentTimestamp: '',
          },
          awsRegion: '',
          body: '',
          eventSource: '',
          eventSourceARN: '',
          md5OfBody: '',
          messageAttributes: {
            id: {
              binaryListValues: [],
              binaryValue: '',
              dataType: 'string',
              stringListValues: [],
              stringValue: 'company-2-id',
            },
            owner: {
              binaryListValues: [],
              binaryValue: '',
              dataType: 'string',
              stringListValues: [],
              stringValue: 'owner-id',
            },
          },
          messageId: 'message-2',
          receiptHandle: '',
        },
        {
          attributes: {
            ApproximateFirstReceiveTimestamp: '',
            ApproximateReceiveCount: '',
            SenderId: '',
            SentTimestamp: '',
          },
          awsRegion: '',
          body: '',
          eventSource: '',
          eventSourceARN: '',
          md5OfBody: '',
          messageAttributes: {
            id: {
              binaryListValues: [],
              binaryValue: '',
              dataType: 'string',
              stringListValues: [],
              stringValue: 'company-2-id',
            },
          },
          messageId: 'message-3',
          receiptHandle: '',
        },
      ],
    };

    sfn = mockClient(SFNClient);
  });

  it('should throw if no state machine ARN is set', async () => {
    await expect(handler(event, context, callback)).rejects.toThrow(
      'No state machine set',
    );
  });

  describe('with state machine ARN is set', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.STATE_MACHINE_ARN = 'state-machice-arn';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should call call start state machine execution the correct number of times', async () => {
      await handler(event, context, callback);

      expect(sfn).toReceiveCommandTimes(StartExecutionCommand, 2);
    });

    it('should call start state machine execution with the correct params', async () => {
      await handler(event, context, callback);

      expect(sfn).toReceiveCommandWith(StartExecutionCommand, {
        input: JSON.stringify({
          id: 'company-1-id',
          owner: 'owner-id',
        }),
        stateMachineArn: 'state-machice-arn',
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
