import {
  BatchWriteItemCommand,
  DescribeTableCommand,
  DynamoDBClient,
  type KeySchemaElement,
  ScanCommand,
  type ScanCommandInput,
  type ScanCommandOutput,
  StreamViewType,
  UpdateTableCommand,
  type WriteRequest,
} from '@aws-sdk/client-dynamodb';
import {
  LambdaClient,
  ListEventSourceMappingsCommand,
} from '@aws-sdk/client-lambda';
import logger from '@motech-development/node-logger';
import type { Context, Handler } from 'aws-lambda';

const client = new DynamoDBClient({});
const lambda = new LambdaClient({});

const MAX_BATCH_SIZE = 25;
const MAX_BATCH_ATTEMPTS = 5;
const MAX_WAIT_ATTEMPTS = 60;
const MAX_STREAM_TRANSITION_MS = 120000;
const STREAM_RECOVERY_BUFFER_MS = 270000;
const EXPECTED_KEYS = ['__typename', 'id'];

function hasContinuationKey(
  key?: ScanCommandInput['ExclusiveStartKey'],
): key is NonNullable<ScanCommandInput['ExclusiveStartKey']> {
  return !!key && Object.keys(key).length > 0;
}

function hasExpectedKeySchema(keySchema?: KeySchemaElement[]) {
  const attributeNames = (keySchema ?? []).map(
    ({ AttributeName }) => AttributeName,
  );

  return (
    attributeNames.length === EXPECTED_KEYS.length &&
    EXPECTED_KEYS.every((expectedKey) => attributeNames.includes(expectedKey))
  );
}

async function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, process.env.NODE_ENV === 'test' ? 0 : ms);
  });
}

function assertTimeForRestore(
  context: Context,
  streamRecoveryRequired: boolean,
) {
  if (
    streamRecoveryRequired &&
    context.getRemainingTimeInMillis() <= STREAM_RECOVERY_BUFFER_MS
  ) {
    throw new Error(
      'Insufficient execution time to safely continue the restore',
    );
  }
}

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];

  for (let index = 0; index < array.length; index += chunkSize) {
    chunks.push(array.slice(index, index + chunkSize));
  }

  return chunks;
}

async function getActiveTableAttempt(tableName: string, attempt: number) {
  const { Table } = await client.send(
    new DescribeTableCommand({
      TableName: tableName,
    }),
  );

  if (!Table) {
    throw new Error(`Unable to describe table ${tableName}`);
  }

  if (Table.TableStatus === 'ACTIVE') {
    return Table;
  }

  if (attempt + 1 >= MAX_WAIT_ATTEMPTS) {
    throw new Error(
      `Timed out waiting for table ${tableName} to become active`,
    );
  }

  await sleep(Math.min(1000 * 2 ** Math.min(attempt, 1), 2000));

  return getActiveTableAttempt(tableName, attempt + 1);
}

async function getActiveTable(tableName: string) {
  return getActiveTableAttempt(tableName, 0);
}

async function assertNoStreamConsumers(tableArn: string, marker?: string) {
  const streamArnPrefix = `${tableArn}/stream/`;
  const response = await lambda.send(
    new ListEventSourceMappingsCommand({
      Marker: marker,
    }),
  );

  const mappings = (response.EventSourceMappings ?? []).filter(
    ({ EventSourceArn }) => EventSourceArn?.startsWith(streamArnPrefix),
  );

  if (mappings.length > 0) {
    throw new Error(
      `Target table has ${mappings.length} Lambda stream mapping(s); detach all target stream consumers before restoring`,
    );
  }

  if (response.NextMarker) {
    await assertNoStreamConsumers(tableArn, response.NextMarker);
  }
}

async function writeBatch(
  tableName: string,
  requests: WriteRequest[],
  context: Context,
  streamRecoveryRequired: boolean,
  attempt = 1,
) {
  assertTimeForRestore(context, streamRecoveryRequired);

  const { UnprocessedItems } = await client.send(
    new BatchWriteItemCommand({
      RequestItems: {
        [tableName]: requests,
      },
    }),
  );

  const remaining = UnprocessedItems?.[tableName] ?? [];

  if (remaining.length === 0) {
    return;
  }

  if (attempt === MAX_BATCH_ATTEMPTS) {
    throw new Error(
      `DynamoDB left ${remaining.length} write request(s) unprocessed after ${MAX_BATCH_ATTEMPTS} attempts for ${tableName}`,
    );
  }

  await sleep(Math.min(1000 * 2 ** (attempt - 1), 10000));

  await writeBatch(
    tableName,
    remaining,
    context,
    streamRecoveryRequired,
    attempt + 1,
  );
}

async function writePages(
  scanTableName: string,
  writeTableName: string,
  toRequests: (
    items: NonNullable<ScanCommandOutput['Items']>,
  ) => WriteRequest[],
  context: Context,
  streamRecoveryRequired: boolean,
  exclusiveStartKey?: ScanCommandInput['ExclusiveStartKey'],
  page = 0,
) {
  assertTimeForRestore(context, streamRecoveryRequired);

  const { Items, LastEvaluatedKey } = await client.send(
    new ScanCommand({
      ConsistentRead: true,
      ExclusiveStartKey: exclusiveStartKey,
      TableName: scanTableName,
    }),
  );

  const requests = toRequests(Items ?? []);
  const batches = chunkArray(requests, MAX_BATCH_SIZE);

  await batches.reduce(
    (result, batch) =>
      result.then(() =>
        writeBatch(writeTableName, batch, context, streamRecoveryRequired),
      ),
    Promise.resolve(),
  );

  logger.info(
    `Processed ${requests.length} ${writeTableName} write(s) from ${scanTableName} scan page ${page + 1}`,
  );

  if (hasContinuationKey(LastEvaluatedKey)) {
    await writePages(
      scanTableName,
      writeTableName,
      toRequests,
      context,
      streamRecoveryRequired,
      LastEvaluatedKey,
      page + 1,
    );
  }
}

async function clear(
  target: string,
  context: Context,
  streamRecoveryRequired: boolean,
) {
  await writePages(
    target,
    target,
    (items) =>
      items.map((item) => ({
        DeleteRequest: {
          Key: {
            // eslint-disable-next-line no-underscore-dangle
            __typename: item.__typename,
            id: item.id,
          },
        },
      })),
    context,
    streamRecoveryRequired,
  );

  logger.info('All target data cleared');
}

async function restore(
  source: string,
  target: string,
  context: Context,
  streamRecoveryRequired: boolean,
) {
  await writePages(
    source,
    target,
    (items) =>
      items.map((item) => ({
        PutRequest: {
          Item: item,
        },
      })),
    context,
    streamRecoveryRequired,
  );

  logger.info('All source data restored');
}

async function waitForStreamState(
  target: string,
  streamEnabled: boolean | undefined,
  streamViewType: StreamViewType | undefined,
  deadline: number,
  attempt: number,
) {
  const { Table } = await client.send(
    new DescribeTableCommand({
      TableName: target,
    }),
  );

  if (!Table) {
    throw new Error(`Unable to describe table ${target}`);
  }

  const enabled = Table.StreamSpecification?.StreamEnabled === true;
  const viewType = Table.StreamSpecification?.StreamViewType;

  if (
    Table.TableStatus === 'ACTIVE' &&
    (streamEnabled === undefined ||
      (enabled === streamEnabled &&
        (!streamEnabled || viewType === streamViewType)))
  ) {
    return Table;
  }

  if (attempt + 1 >= MAX_WAIT_ATTEMPTS || Date.now() >= deadline) {
    let timeoutMessage = `Timed out waiting for table ${target} to become active`;

    if (streamEnabled !== undefined) {
      const desiredState = streamEnabled ? 'enabled' : 'disabled';
      timeoutMessage = `Timed out waiting for target table stream to become ${desiredState}`;
    }

    throw new Error(timeoutMessage);
  }

  await sleep(Math.min(2000, deadline - Date.now()));

  return waitForStreamState(
    target,
    streamEnabled,
    streamViewType,
    deadline,
    attempt + 1,
  );
}

async function setStreamEnabled(
  target: string,
  streamEnabled: boolean,
  streamViewType: StreamViewType | undefined,
  context: Context,
  reserveRecoveryTime = false,
) {
  const remainingTime = context.getRemainingTimeInMillis();
  const reservedTime = reserveRecoveryTime ? STREAM_RECOVERY_BUFFER_MS : 0;
  const deadline =
    Date.now() +
    Math.min(MAX_STREAM_TRANSITION_MS, remainingTime - reservedTime);

  if (deadline <= Date.now()) {
    throw new Error(
      'Insufficient execution time to safely change target table streams',
    );
  }

  const current = await waitForStreamState(
    target,
    undefined,
    undefined,
    deadline,
    0,
  );
  const currentlyEnabled = current.StreamSpecification?.StreamEnabled === true;
  const currentViewType = current.StreamSpecification?.StreamViewType;

  if (currentlyEnabled === streamEnabled) {
    if (!streamEnabled || currentViewType === streamViewType) {
      return;
    }
  }

  await client.send(
    new UpdateTableCommand({
      StreamSpecification: streamEnabled
        ? {
            StreamEnabled: true,
            StreamViewType: streamViewType,
          }
        : {
            StreamEnabled: false,
          },
      TableName: target,
    }),
  );

  await waitForStreamState(target, streamEnabled, streamViewType, deadline, 0);
}

async function validateTables(source: string, target: string) {
  if (source === target) {
    throw new Error('Source and target tables must be different');
  }

  const [sourceTable, targetTable] = await Promise.all([
    getActiveTable(source),
    getActiveTable(target),
  ]);
  if (
    !hasExpectedKeySchema(sourceTable.KeySchema) ||
    !hasExpectedKeySchema(targetTable.KeySchema)
  ) {
    throw new Error(
      `Source and target tables must use the ${EXPECTED_KEYS.join(' and ')} key schema`,
    );
  }

  if (!sourceTable.TableArn || !targetTable.TableArn) {
    throw new Error('Unable to determine source and target table ARNs');
  }

  if (sourceTable.TableArn === targetTable.TableArn) {
    throw new Error('Source and target tables must be different');
  }

  await assertNoStreamConsumers(targetTable.TableArn);

  if (targetTable.StreamSpecification?.StreamEnabled !== true) {
    return undefined;
  }

  const streamViewType = targetTable.StreamSpecification.StreamViewType;

  if (!streamViewType) {
    throw new Error('Unable to determine target table stream view type');
  }

  return streamViewType;
}

class RestoreAndRecoveryError extends Error {
  readonly errors: [unknown, unknown];

  constructor(restoreError: unknown, recoveryError: unknown) {
    super('Restore failed and stream recovery also failed');
    this.name = 'RestoreAndRecoveryError';
    this.errors = [restoreError, recoveryError];
  }
}

function toError(error: unknown, message: string) {
  if (error instanceof Error) {
    return error;
  }

  const wrapped = new Error(message);
  Object.defineProperty(wrapped, 'cause', {
    value: error,
  });

  return wrapped;
}

export const handler: Handler = async (_event, context) => {
  const { SOURCE, TARGET } = process.env;

  if (!SOURCE || !TARGET) {
    throw new Error('Missing source or target table');
  }

  const originalStreamViewType = await validateTables(SOURCE, TARGET);
  let restoreError: unknown;
  let restoreFailed = false;

  try {
    if (originalStreamViewType) {
      if (context.getRemainingTimeInMillis() <= STREAM_RECOVERY_BUFFER_MS * 2) {
        throw new Error(
          'Insufficient execution time to safely change target table streams',
        );
      }

      await setStreamEnabled(TARGET, false, undefined, context, true);
    }

    await clear(TARGET, context, !!originalStreamViewType);
    await restore(SOURCE, TARGET, context, !!originalStreamViewType);
  } catch (error) {
    restoreFailed = true;
    restoreError = error;
  }

  let recoveryError: unknown;
  let recoveryFailed = false;

  if (originalStreamViewType) {
    try {
      await setStreamEnabled(TARGET, true, originalStreamViewType, context);
    } catch (error) {
      recoveryFailed = true;
      recoveryError = error;
    }
  }

  if (restoreFailed && recoveryFailed) {
    logger.error('Restore failed and stream recovery also failed', {
      recoveryError,
      restoreError,
    });

    throw new RestoreAndRecoveryError(restoreError, recoveryError);
  }

  if (restoreFailed) {
    logger.error(
      'Restore failed; original stream state was recovered',
      restoreError,
    );
    throw toError(restoreError, 'Restore failed with a non-Error value');
  }

  if (recoveryFailed) {
    logger.error('Restore succeeded but stream recovery failed', recoveryError);
    throw toError(
      recoveryError,
      'Stream recovery failed with a non-Error value',
    );
  }

  logger.info('Process complete');
};
