import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteScheduleCommand,
  SchedulerClient,
} from '@aws-sdk/client-scheduler';
import { SendMessageBatchCommand, SQSClient } from '@aws-sdk/client-sqs';
import {
  GetCommand,
  TransactWriteCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import type { Context, DynamoDBStreamEvent } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import { handler } from '../process-stream';
import { ITransaction, TransactionStatus } from '../shared/transaction';

const transaction: ITransaction = {
  __typename: 'Transaction',
  amount: 100.25,
  attachment: '',
  category: 'Sales',
  companyId: 'company-id',
  date: '2019-12-15T00:00:00.000Z',
  description: 'Description 1',
  id: 'transaction-1',
  name: 'Transaction 1',
  owner: 'owner',
  scheduled: false,
  status: TransactionStatus.Confirmed,
  vat: 1.2,
};

const scheduledTransaction: ITransaction = {
  ...transaction,
  attachment: 'attachment.pdf',
  id: 'transaction-2',
  scheduled: true,
  status: TransactionStatus.Pending,
};

describe('process-stream', () => {
  let context: Context;
  let ddb: AwsClientStub<DynamoDBClient>;
  let event: DynamoDBStreamEvent;
  let originalEnvironment: NodeJS.ProcessEnv;
  let scheduler: AwsClientStub<SchedulerClient>;
  let sqs: AwsClientStub<SQSClient>;

  beforeEach(() => {
    context = ctx();
    context.done();
    ddb = mockClient(DynamoDBClient);
    ddb.on(GetCommand).resolves({});
    scheduler = mockClient(SchedulerClient);
    sqs = mockClient(SQSClient);
    sqs.on(SendMessageBatchCommand).resolves({});
    originalEnvironment = process.env;
    process.env = {
      ...process.env,
      ATTACHMENT_QUEUE: 'attachment-queue',
      PUBLICATION_QUEUE_ARN: 'arn:aws:sqs:eu-west-1:123456789012:publication',
      SCHEDULER_DELIVERY_DLQ_ARN:
        'arn:aws:sqs:eu-west-1:123456789012:scheduler-delivery-dlq',
      SCHEDULER_ROLE_ARN:
        'arn:aws:iam::123456789012:role/scheduler-publication',
      SCHEDULE_GROUP: 'accounts-test-scheduled-transactions',
      TABLE: 'app-table',
    };
    event = {
      Records: [
        {
          dynamodb: {
            NewImage: marshall(transaction) as never,
          },
          eventID: 'event-1',
          eventName: 'INSERT',
        },
        {
          dynamodb: {
            OldImage: marshall(scheduledTransaction) as never,
          },
          eventID: 'event-2',
          eventName: 'REMOVE',
        },
      ],
    };
  });

  afterEach(() => {
    process.env = originalEnvironment;
  });

  it('applies the balance, typeahead, schedule and attachment work for a batch', async () => {
    await handler(event, context, vi.fn());

    expect(ddb).toReceiveCommandWith(TransactWriteCommand, {
      TransactItems: expect.arrayContaining([
        expect.objectContaining({
          Put: expect.objectContaining({
            Item: expect.objectContaining({
              __typename: 'BalanceEvent',
              id: 'event-1',
            }) as unknown,
          }) as unknown,
        }),
      ]) as never,
    });
    expect(ddb).toReceiveCommandWith(GetCommand, {
      Key: {
        __typename: 'Typeahead',
        id: 'company-id',
      },
    });
    expect(ddb).toReceiveCommandTimes(UpdateCommand, 1);
    expect(scheduler).toReceiveCommandWith(DeleteScheduleCommand, {
      Name: 'transaction-transaction-2',
    });
    expect(sqs).toReceiveCommandTimes(SendMessageBatchCommand, 1);
  });

  it('rejects the batch when any step fails so that it is retried', async () => {
    const error = new Error('Something has gone wrong');

    sqs.on(SendMessageBatchCommand).rejects(error);

    await expect(handler(event, context, vi.fn())).rejects.toThrow(error);
  });
});
