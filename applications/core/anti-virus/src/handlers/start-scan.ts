import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';
import { SQSHandler } from 'aws-lambda';

const stepFunctions = new SFNClient({});

export const handler: SQSHandler = async (event) => {
  const { STATE_MACHINE_ARN } = process.env;

  if (!STATE_MACHINE_ARN) {
    throw new Error('No state machine set');
  }

  const executions = event.Records.map((record) => {
    const { messageAttributes } = record;
    const { from, key, to } = messageAttributes;
    const command = new StartExecutionCommand({
      input: JSON.stringify({
        from: from.stringValue,
        key: key.stringValue,
        to: to.stringValue,
      }),
      stateMachineArn: STATE_MACHINE_ARN,
    });

    return stepFunctions.send(command);
  });

  await Promise.all(executions);
};
