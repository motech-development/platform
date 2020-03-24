import { Handler, SQSEvent } from 'aws-lambda';
import { StepFunctions } from 'aws-sdk';

const stepFunctions = new StepFunctions();

export const handler: Handler<SQSEvent> = async event => {
  const { STATE_MACHINE_ARN } = process.env;

  if (!STATE_MACHINE_ARN) {
    throw new Error('No state machine set');
  }

  await Promise.all(
    event.Records.map(record => {
      const { messageAttributes } = record;

      return stepFunctions
        .startExecution({
          input: JSON.stringify({
            id: messageAttributes.id.stringValue,
            owner: messageAttributes.owner.stringValue,
          }),
          stateMachineArn: STATE_MACHINE_ARN,
        })
        .promise();
    }),
  );
};
