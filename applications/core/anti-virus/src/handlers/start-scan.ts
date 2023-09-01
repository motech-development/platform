import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { AWSLambda } from '@sentry/serverless';
import { SQSHandler } from 'aws-lambda';

AWSLambda.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new ProfilingIntegration()],
  profilesSampleRate: 1.0,
  tracesSampleRate: 1.0,
});

const stepFunctions = new SFNClient({});

export const handler: SQSHandler = AWSLambda.wrapHandler(async (event) => {
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
