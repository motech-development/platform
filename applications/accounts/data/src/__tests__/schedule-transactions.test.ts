import type { UpdateScheduleCommandInput } from '@aws-sdk/client-scheduler';
import {
  ConflictException,
  CreateScheduleCommand,
  DeleteScheduleCommand,
  ResourceNotFoundException,
  SchedulerClient,
  UpdateScheduleCommand,
} from '@aws-sdk/client-scheduler';
import { marshall } from '@aws-sdk/util-dynamodb';
import type { DynamoDBStreamEvent } from 'aws-lambda';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import { synchroniseSchedules } from '../schedule-transactions';
import { ITransaction, TransactionStatus } from '../shared/transaction';

const transaction: ITransaction = {
  __typename: 'Transaction',
  amount: 100.25,
  attachment: '',
  category: 'Sales',
  companyId: 'company-id',
  date: '2020-06-07T00:00:00.000Z',
  description: 'Description',
  id: 'transaction-id',
  name: 'Transaction',
  owner: 'owner',
  scheduled: true,
  status: TransactionStatus.Pending,
  vat: 20.05,
};

const insertEvent = (record: ITransaction): DynamoDBStreamEvent => ({
  Records: [
    {
      dynamodb: {
        NewImage: marshall(record) as never,
      },
      eventName: 'INSERT',
    },
  ],
});

const modifyEvent = (
  oldRecord: ITransaction,
  newRecord: ITransaction,
): DynamoDBStreamEvent => ({
  Records: [
    {
      dynamodb: {
        NewImage: marshall(newRecord) as never,
        OldImage: marshall(oldRecord) as never,
      },
      eventName: 'MODIFY',
    },
  ],
});

const removeEvent = (record: ITransaction): DynamoDBStreamEvent => ({
  Records: [
    {
      dynamodb: {
        OldImage: marshall(record) as never,
      },
      eventName: 'REMOVE',
    },
  ],
});

describe('schedule-transactions', () => {
  let scheduler: AwsClientStub<SchedulerClient>;
  let originalEnvironment: NodeJS.ProcessEnv;

  beforeEach(() => {
    scheduler = mockClient(SchedulerClient);
    originalEnvironment = process.env;
    process.env = {
      ...process.env,
      PUBLICATION_QUEUE_ARN: 'arn:aws:sqs:eu-west-1:123456789012:publication',
      SCHEDULER_DELIVERY_DLQ_ARN:
        'arn:aws:sqs:eu-west-1:123456789012:scheduler-delivery-dlq',
      SCHEDULER_ROLE_ARN:
        'arn:aws:iam::123456789012:role/scheduler-publication',
      SCHEDULE_GROUP: 'accounts-test-scheduled-transactions',
    };
  });

  afterEach(() => {
    process.env = originalEnvironment;
  });

  it('creates a one-time schedule when a Pending Transaction is scheduled', async () => {
    await synchroniseSchedules(insertEvent(transaction));

    expect(scheduler).toReceiveCommandWith(CreateScheduleCommand, {
      ActionAfterCompletion: 'DELETE',
      FlexibleTimeWindow: {
        Mode: 'OFF',
      },
      GroupName: 'accounts-test-scheduled-transactions',
      Name: 'transaction-transaction-id',
      ScheduleExpression: 'at(2020-06-07T00:00:00)',
      ScheduleExpressionTimezone: 'UTC',
      State: 'ENABLED',
      Target: {
        Arn: 'arn:aws:sqs:eu-west-1:123456789012:publication',
        DeadLetterConfig: {
          Arn: 'arn:aws:sqs:eu-west-1:123456789012:scheduler-delivery-dlq',
        },
        Input: JSON.stringify({
          expectedScheduledTime: '2020-06-07T00:00:00.000Z',
          transactionId: 'transaction-id',
        }),
        RetryPolicy: {
          MaximumEventAgeInSeconds: 86400,
          MaximumRetryAttempts: 185,
        },
        RoleArn: 'arn:aws:iam::123456789012:role/scheduler-publication',
      },
    });
  });

  it('updates the schedule when its Transaction Date changes', async () => {
    const rescheduledTransaction = {
      ...transaction,
      date: '2020-06-08T00:00:00.000Z',
    };

    await synchroniseSchedules(
      modifyEvent(transaction, rescheduledTransaction),
    );

    expect(scheduler).toReceiveCommandWith(UpdateScheduleCommand, {
      GroupName: 'accounts-test-scheduled-transactions',
      Name: 'transaction-transaction-id',
      ScheduleExpression: 'at(2020-06-08T00:00:00)',
      Target: expect.objectContaining({
        Input: JSON.stringify({
          expectedScheduledTime: '2020-06-08T00:00:00.000Z',
          transactionId: 'transaction-id',
        }),
      }) as UpdateScheduleCommandInput['Target'],
    });
  });

  it('creates a schedule when scheduling is enabled', async () => {
    await synchroniseSchedules(
      modifyEvent(
        {
          ...transaction,
          scheduled: false,
        },
        transaction,
      ),
    );

    expect(scheduler).toReceiveCommandWith(CreateScheduleCommand, {
      GroupName: 'accounts-test-scheduled-transactions',
      Name: 'transaction-transaction-id',
    });
  });

  it('recreates a missing schedule when its Transaction Date changes', async () => {
    scheduler.on(UpdateScheduleCommand).rejects(
      new ResourceNotFoundException({
        $metadata: {},
        Message: 'Schedule does not exist',
        message: 'Schedule does not exist',
      }),
    );

    await synchroniseSchedules(
      modifyEvent(transaction, {
        ...transaction,
        date: '2020-06-08T00:00:00.000Z',
      }),
    );

    expect(scheduler).toReceiveCommandWith(CreateScheduleCommand, {
      GroupName: 'accounts-test-scheduled-transactions',
      Name: 'transaction-transaction-id',
    });
  });

  it('does not disturb the schedule for an unrelated edit', async () => {
    await synchroniseSchedules(
      modifyEvent(transaction, {
        ...transaction,
        description: 'Corrected description',
      }),
    );

    expect(scheduler.calls()).toHaveLength(0);
  });

  it.each([
    [
      'scheduling is disabled',
      modifyEvent(transaction, {
        ...transaction,
        scheduled: false,
      }),
    ],
    [
      'the Transaction is manually confirmed',
      modifyEvent(transaction, {
        ...transaction,
        status: TransactionStatus.Confirmed,
      }),
    ],
    ['the Transaction is deleted', removeEvent(transaction)],
  ])('deletes the schedule when %s', async (_description, event) => {
    await synchroniseSchedules(event);

    expect(scheduler).toReceiveCommandWith(DeleteScheduleCommand, {
      GroupName: 'accounts-test-scheduled-transactions',
      Name: 'transaction-transaction-id',
    });
  });

  it('treats an already absent schedule as reconciled', async () => {
    scheduler.on(DeleteScheduleCommand).rejects(
      new ResourceNotFoundException({
        $metadata: {},
        Message: 'Schedule does not exist',
        message: 'Schedule does not exist',
      }),
    );

    await expect(
      synchroniseSchedules(removeEvent(transaction)),
    ).resolves.toBeUndefined();
  });

  it('reconciles a duplicate create delivery into the existing schedule', async () => {
    scheduler.on(CreateScheduleCommand).rejects(
      new ConflictException({
        $metadata: {},
        Message: 'Schedule already exists',
        message: 'Schedule already exists',
      }),
    );

    await synchroniseSchedules(insertEvent(transaction));

    expect(scheduler).toReceiveCommandTimes(CreateScheduleCommand, 1);
    expect(scheduler).toReceiveCommandWith(UpdateScheduleCommand, {
      GroupName: 'accounts-test-scheduled-transactions',
      Name: 'transaction-transaction-id',
    });
  });

  it('processes dependent changes in stream order', async () => {
    const rescheduledTransaction = {
      ...transaction,
      date: '2020-06-08T00:00:00.000Z',
    };
    const event: DynamoDBStreamEvent = {
      Records: [
        ...insertEvent(transaction).Records,
        ...modifyEvent(transaction, rescheduledTransaction).Records,
      ],
    };

    await synchroniseSchedules(event);

    expect(scheduler.calls().map(({ args }) => args[0].constructor)).toEqual([
      CreateScheduleCommand,
      UpdateScheduleCommand,
    ]);
  });

  it('throws Scheduler failures so the stream event source can retry', async () => {
    const error = new Error('Scheduler unavailable');
    scheduler.on(UpdateScheduleCommand).rejects(error);

    await expect(
      synchroniseSchedules(
        modifyEvent(transaction, {
          ...transaction,
          date: '2020-06-08T00:00:00.000Z',
        }),
      ),
    ).rejects.toThrow(error);
  });
});
