import { SQS } from 'aws-sdk';

const sqs = new SQS();

export interface IEvent {
  id: string;
  owner: string;
}

const queueCompanyDelete = async (event: IEvent) => {
  const { QUEUE_URL } = process.env;

  if (!QUEUE_URL) {
    throw new Error('No queue set');
  }

  const { id, owner } = event;

  await sqs
    .sendMessage({
      DelaySeconds: 60,
      MessageAttributes: {
        id: {
          DataType: 'String',
          StringValue: id,
        },
        owner: {
          DataType: 'String',
          StringValue: owner,
        },
      },
      MessageBody: `Delete company ${id}`,
      QueueUrl: QUEUE_URL,
    })
    .promise();
};

export default queueCompanyDelete;
