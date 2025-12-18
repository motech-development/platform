import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';
import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type { Handler, SQSEvent } from 'aws-lambda';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profilesSampleRate: 1.0,
  tracesSampleRate: 1.0,
});

const stepFunctions = new SFNClient({});

export const handler: Handler<SQSEvent> = wrapHandler(async (event) => {
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

      return Promise.resolve();
    }),
  );
});
