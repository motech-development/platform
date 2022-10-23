import { SQSHandler } from 'aws-lambda';
import { StepFunctions } from 'aws-sdk';

const stepFunctions = new StepFunctions();

export const handler: SQSHandler = async (event) => {
  const { STATE_MACHINE_ARN } = process.env;

  if (!STATE_MACHINE_ARN) {
    throw new Error('No state machine set');
  }

  const executions = event.Records.map((record) => {
    const { messageAttributes } = record;
    const { from, key, to } = messageAttributes;

    return stepFunctions
      .startExecution({
        input: JSON.stringify({
          from: from.stringValue,
          key: key.stringValue,
          to: to.stringValue,
        }),
        stateMachineArn: STATE_MACHINE_ARN,
      })
      .promise();
  });

  await Promise.all(executions);
};
