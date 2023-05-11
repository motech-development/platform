import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';
import { Handler, SQSEvent } from 'aws-lambda';

const stepFunctions = new SFNClient({});

export const handler: Handler<SQSEvent> = async (event) => {
  const { STATE_MACHINE_ARN } = process.env;

  if (!STATE_MACHINE_ARN) {
    throw new Error('No state machine set');
  }

  await Promise.all(
    event.Records.map((record) => {
      const { messageAttributes } = record;

      if (
        messageAttributes.id?.stringValue &&
        messageAttributes.owner?.stringValue
      ) {
        const command = new StartExecutionCommand({
          input: JSON.stringify({
            id: messageAttributes.id.stringValue,
            owner: messageAttributes.owner.stringValue,
          }),
          stateMachineArn: STATE_MACHINE_ARN,
        });

        return stepFunctions.send(command);
      }

      return null;
    }),
  );
};
