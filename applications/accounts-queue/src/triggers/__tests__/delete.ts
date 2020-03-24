import { Context, SQSEvent } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { StepFunctions } from 'aws-sdk';
import { handler } from '../delete';

describe('delete', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: SQSEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();

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
          messageId: '',
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
          messageId: '',
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
          messageId: '',
          receiptHandle: '',
        },
      ],
    };
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

      expect(StepFunctions.prototype.startExecution).toHaveBeenCalledTimes(2);
    });

    it('should call start state machine execution with the correct params', async () => {
      await handler(event, context, callback);

      expect(StepFunctions.prototype.startExecution).toHaveBeenCalledWith({
        input: JSON.stringify({
          id: 'company-1-id',
          owner: 'owner-id',
        }),
        stateMachineArn: 'state-machice-arn',
      });
    });
  });
});
