import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';
import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { SQSHandler } from 'aws-lambda';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profilesSampleRate: 1.0,
  tracesSampleRate: 1.0,
});

const stepFunctions = new SFNClient({});

export const handler: SQSHandler = wrapHandler(async (event) => {
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
});
