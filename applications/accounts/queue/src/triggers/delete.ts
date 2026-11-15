import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';
import { captureException, init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type { Handler, SQSEvent } from 'aws-lambda';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profileLifecycle: 'trace',
  profileSessionSampleRate: 1,
  tracesSampleRate: 1,
});

const stepFunctions = new SFNClient({});

export const handler: Handler<SQSEvent> = wrapHandler(async (event) => {
  const { STATE_MACHINE_ARN } = process.env;

  if (!STATE_MACHINE_ARN) {
    throw new Error('No state machine set');
  }

  const results = await Promise.allSettled(
    event.Records.map(async ({ messageAttributes }) => {
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

        await stepFunctions.send(command);
      }
    }),
  );

  return {
    batchItemFailures: results.flatMap((result, index) => {
      if (result.status === 'fulfilled') return [];

      captureException(result.reason);

      return [
        {
          itemIdentifier: event.Records[index].messageId,
        },
      ];
    }),
  };
});
