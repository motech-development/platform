import {
  DynamoDBClient,
  TransactionCanceledException,
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type { SQSHandler } from 'aws-lambda';
import { v4 as uuid } from 'uuid';
import {
  IPublicationCommand,
  parsePublicationCommand,
} from './shared/publication-command';
import { ITransaction, TransactionStatus } from './shared/transaction';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profileLifecycle: 'trace',
  profileSessionSampleRate: 1,
  tracesSampleRate: 1,
});

const documentClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const requiredTable = (): string => {
  const { TABLE } = process.env;

  if (!TABLE) {
    throw new Error('No table set');
  }

  return TABLE;
};

const publishTransaction = async (
  tableName: string,
  command: IPublicationCommand,
) => {
  const result = await documentClient.send(
    new GetCommand({
      ConsistentRead: true,
      Key: {
        __typename: 'Transaction',
        id: command.transactionId,
      },
      TableName: tableName,
    }),
  );
  const transaction = result.Item as ITransaction | undefined;

  if (
    transaction?.status !== TransactionStatus.Pending ||
    !transaction.scheduled ||
    transaction.date !== command.expectedScheduledTime
  ) {
    return;
  }

  const updatedAt = new Date().toISOString();

  try {
    await documentClient.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Update: {
              ConditionExpression:
                '#status = :pending AND #scheduled = :scheduled AND #date = :expectedScheduledTime',
              ExpressionAttributeNames: {
                '#data': 'data',
                '#date': 'date',
                '#scheduled': 'scheduled',
                '#status': 'status',
                '#updatedAt': 'updatedAt',
              },
              ExpressionAttributeValues: {
                ':confirmed': TransactionStatus.Confirmed,
                ':data': `${transaction.owner}:${transaction.companyId}:confirmed:${transaction.date}`,
                ':expectedScheduledTime': command.expectedScheduledTime,
                ':notScheduled': false,
                ':pending': TransactionStatus.Pending,
                ':scheduled': true,
                ':updatedAt': updatedAt,
              },
              Key: {
                __typename: 'Transaction',
                id: transaction.id,
              },
              TableName: tableName,
              UpdateExpression:
                'SET #data = :data, #scheduled = :notScheduled, #status = :confirmed, #updatedAt = :updatedAt',
            },
          },
          {
            Put: {
              Item: {
                __typename: 'Notification',
                createdAt: updatedAt,
                data: `${transaction.owner}:Notification:${updatedAt}`,
                id: uuid(),
                message: 'TRANSACTION_PUBLISHED',
                owner: transaction.owner,
                read: false,
              },
              TableName: tableName,
            },
          },
        ],
      }),
    );
  } catch (error) {
    if (
      error instanceof TransactionCanceledException &&
      error.CancellationReasons?.some(
        ({ Code }) => Code === 'ConditionalCheckFailed',
      )
    ) {
      return;
    }

    throw error;
  }
};

export const handler: SQSHandler = wrapHandler(async (event) => {
  const tableName = requiredTable();

  await Promise.all(
    event.Records.map(({ body }) =>
      publishTransaction(tableName, parsePublicationCommand(body)),
    ),
  );
});
