import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';
import { Context, SQSEvent } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import { handler } from '../start-scan';

describe('start-scan', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: SQSEvent;
  let sfn: AwsClientStub<SFNClient>;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();

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
  });
});
