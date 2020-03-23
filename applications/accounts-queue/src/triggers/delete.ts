import { Handler, SQSEvent } from 'aws-lambda';

export const handler: Handler<SQSEvent> = (event, _, callback) => {
  // TODO: Trigger step function
  event.Records.forEach(record => {
    const { messageAttributes } = record;

    console.log('OUTPUT', messageAttributes);
  });

  callback(null, 'OK');
};
