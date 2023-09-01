import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { AWSLambda } from '@sentry/serverless';
import { Handler, SQSEvent } from 'aws-lambda';

AWSLambda.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new ProfilingIntegration()],
  profilesSampleRate: 1.0,
  tracesSampleRate: 1.0,
});

const stepFunctions = new SFNClient({});

export const handler: Handler<SQSEvent> = AWSLambda.wrapHandler(
  async (event) => {
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
  },
);
