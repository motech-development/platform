import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import type { BatchWriteCommandInput } from '@aws-sdk/lib-dynamodb';
import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type { Handler } from 'aws-lambda';
import type { IOutput as IGetRecordsOutput } from './get-records';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profileLifecycle: 'trace',
  profileSessionSampleRate: 1,
  tracesSampleRate: 1,
});

const documentClient = new DynamoDBClient({});

export type IEvent = IGetRecordsOutput;

const MAX_RETRIES = 4;
const INITIAL_RETRY_DELAY_MS = 25;

const wait = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

export const handler: Handler<IEvent> = wrapHandler(async (event) => {
  const { TABLE, TYPENAME } = process.env;

  if (!TABLE) {
    throw new Error('No table set');
  }

  if (!TYPENAME) {
    throw new Error('No typename set');
  }

  const { items } = event;

  if (items.length > 25) {
    throw new Error('Cannot delete more than 25 records in one batch');
  }

  const initialItems = items.map((id) => ({
    DeleteRequest: {
      Key: {
        __typename: TYPENAME,
        id,
      },
    },
  }));

  const writeBatch = async (
    pendingItems: NonNullable<BatchWriteCommandInput['RequestItems']>[string],
    retry = 0,
  ): Promise<void> => {
    if (pendingItems.length === 0) {
      return;
    }

    const command = new BatchWriteCommand({
      RequestItems: {
        [TABLE]: pendingItems,
      },
    });

    const response = (await documentClient.send(command)) ?? {};
    const { UnprocessedItems } = response;
    const unprocessed = UnprocessedItems ?? {};
    const hasUnprocessedItems = Object.values(unprocessed).some(
      (requests) => requests.length > 0,
    );

    if (!hasUnprocessedItems) {
      return;
    }

    const unexpectedTable = Object.entries(unprocessed).find(
      ([tableName, requests]) => tableName !== TABLE && requests.length > 0,
    );

    if (unexpectedTable) {
      throw new Error(
        `BatchWrite returned unprocessed items for unexpected table ${unexpectedTable[0]}`,
      );
    }

    if (retry >= MAX_RETRIES) {
      throw new Error(
        `BatchWrite still has unprocessed items after ${MAX_RETRIES + 1} attempts`,
      );
    }

    await wait(INITIAL_RETRY_DELAY_MS * 2 ** retry);

    await writeBatch(unprocessed[TABLE] ?? [], retry + 1);
  };

  await writeBatch(initialItems);

  return {
    ...event,
    complete: !event.lastEvaluatedKey,
  };
});
