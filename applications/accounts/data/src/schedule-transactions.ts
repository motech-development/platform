import {
  ConflictException,
  CreateScheduleCommand,
  DeleteScheduleCommand,
  ResourceNotFoundException,
  SchedulerClient,
  UpdateScheduleCommand,
} from '@aws-sdk/client-scheduler';
import { NativeAttributeValue, unmarshall } from '@aws-sdk/util-dynamodb';
import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type { DynamoDBRecord, DynamoDBStreamHandler } from 'aws-lambda';
import { serializePublicationCommand } from './shared/publication-command';
import { ITransaction, TransactionStatus } from './shared/transaction';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profileLifecycle: 'trace',
  profileSessionSampleRate: 1,
  tracesSampleRate: 1,
});

const scheduler = new SchedulerClient({});

const requiredEnvironment = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`No ${name.toLowerCase().replace(/_/g, ' ')} set`);
  }

  return value;
};

const isScheduled = (transaction: ITransaction): boolean =>
  transaction.scheduled && transaction.status === TransactionStatus.Pending;

const scheduleInput = (transaction: ITransaction) => {
  const publicationQueueArn = requiredEnvironment('PUBLICATION_QUEUE_ARN');
  const scheduleGroup = requiredEnvironment('SCHEDULE_GROUP');
  const schedulerDeliveryDlqArn = requiredEnvironment(
    'SCHEDULER_DELIVERY_DLQ_ARN',
  );
  const schedulerRoleArn = requiredEnvironment('SCHEDULER_ROLE_ARN');
  const scheduleTime = new Date(transaction.date)
    .toISOString()
    .replace(/\.\d{3}Z$/, '');

  return {
    ActionAfterCompletion: 'DELETE' as const,
    FlexibleTimeWindow: {
      Mode: 'OFF' as const,
    },
    GroupName: scheduleGroup,
    Name: `transaction-${transaction.id}`,
    ScheduleExpression: `at(${scheduleTime})`,
    ScheduleExpressionTimezone: 'UTC',
    State: 'ENABLED' as const,
    Target: {
      Arn: publicationQueueArn,
      DeadLetterConfig: {
        Arn: schedulerDeliveryDlqArn,
      },
      Input: serializePublicationCommand({
        expectedScheduledTime: transaction.date,
        transactionId: transaction.id,
      }),
      RetryPolicy: {
        MaximumEventAgeInSeconds: 86400,
        MaximumRetryAttempts: 185,
      },
      RoleArn: schedulerRoleArn,
    },
  };
};

const createSchedule = async (transaction: ITransaction) => {
  try {
    await scheduler.send(new CreateScheduleCommand(scheduleInput(transaction)));
  } catch (error) {
    if (!(error instanceof ConflictException)) {
      throw error;
    }

    await scheduler.send(new UpdateScheduleCommand(scheduleInput(transaction)));
  }
};

const updateSchedule = async (transaction: ITransaction) => {
  try {
    await scheduler.send(new UpdateScheduleCommand(scheduleInput(transaction)));
  } catch (error) {
    if (!(error instanceof ResourceNotFoundException)) {
      throw error;
    }

    await scheduler.send(new CreateScheduleCommand(scheduleInput(transaction)));
  }
};

const deleteSchedule = async (transactionId: string) => {
  try {
    await scheduler.send(
      new DeleteScheduleCommand({
        GroupName: requiredEnvironment('SCHEDULE_GROUP'),
        Name: `transaction-${transactionId}`,
      }),
    );
  } catch (error) {
    if (!(error instanceof ResourceNotFoundException)) {
      throw error;
    }
  }
};

const transactionFromImage = (
  image: Record<string, NativeAttributeValue> | undefined,
): ITransaction | undefined =>
  image ? (unmarshall(image) as ITransaction) : undefined;

const reconcileRecord = async (record: DynamoDBRecord): Promise<void> => {
  const newTransaction = transactionFromImage(
    record.dynamodb?.NewImage as
      | Record<string, NativeAttributeValue>
      | undefined,
  );
  const oldTransaction = transactionFromImage(
    record.dynamodb?.OldImage as
      | Record<string, NativeAttributeValue>
      | undefined,
  );

  if (
    (newTransaction && newTransaction.__typename !== 'Transaction') ||
    (oldTransaction && oldTransaction.__typename !== 'Transaction')
  ) {
    return;
  }

  if (
    record.eventName === 'REMOVE' &&
    oldTransaction &&
    isScheduled(oldTransaction)
  ) {
    await deleteSchedule(oldTransaction.id);
    return;
  }

  if (!newTransaction) {
    return;
  }

  if (record.eventName === 'INSERT' && isScheduled(newTransaction)) {
    await createSchedule(newTransaction);
    return;
  }

  if (record.eventName !== 'MODIFY' || !oldTransaction) {
    return;
  }

  const wasScheduled = isScheduled(oldTransaction);
  const remainsScheduled = isScheduled(newTransaction);

  if (wasScheduled && !remainsScheduled) {
    await deleteSchedule(newTransaction.id);
  } else if (!wasScheduled && remainsScheduled) {
    await createSchedule(newTransaction);
  } else if (remainsScheduled && oldTransaction.date !== newTransaction.date) {
    await updateSchedule(newTransaction);
  }
};

export const handler: DynamoDBStreamHandler = wrapHandler(async (event) => {
  await event.Records.reduce(
    (previous, record) => previous.then(() => reconcileRecord(record)),
    Promise.resolve(),
  );
});
