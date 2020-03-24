import { SQS } from 'aws-sdk';
import queueCompanyDelete, { IEvent } from '../queue-company-delete';

describe('queue-company-delete', () => {
  let event: IEvent;

  beforeEach(() => {
    event = {
      id: 'id',
      owner: 'owner',
    };
  });

  it('should throw if no queue URL is set', async () => {
    await expect(queueCompanyDelete(event)).rejects.toThrow('No queue set');
  });

  describe('with a queue URL set', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.QUEUE_URL = 'queue_url';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should call the queue with the correct params', async () => {
      await queueCompanyDelete(event);

      expect(SQS.prototype.sendMessage).toHaveBeenCalledWith({
        DelaySeconds: 60,
        MessageAttributes: {
          id: {
            DataType: 'String',
            StringValue: 'id',
          },
          owner: {
            DataType: 'String',
            StringValue: 'owner',
          },
        },
        MessageBody: 'Delete company id',
        QueueUrl: 'queue_url',
      });
    });
  });
});
