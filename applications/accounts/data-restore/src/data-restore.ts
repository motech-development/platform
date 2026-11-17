import {
  CloudWatchClient,
  GetMetricDataCommand,
} from '@aws-sdk/client-cloudwatch';
import {
  AttributeValue,
  BatchWriteItemCommand,
  DescribeTableCommand,
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
  WriteRequest,
} from '@aws-sdk/client-dynamodb';
import {
  EventSourceMappingConfiguration,
  GetEventSourceMappingCommand,
  LambdaClient,
  ListEventSourceMappingsCommand,
  UpdateEventSourceMappingCommand,
  UpdateEventSourceMappingCommandInput,
} from '@aws-sdk/client-lambda';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import logger from '@motech-development/node-logger';
import type { Handler } from 'aws-lambda';

const client = new DynamoDBClient({});

const cloudwatch = new CloudWatchClient({});

const lambda = new LambdaClient({});

const maximumRecordAge = 60;

// Disabled mappings kept delivering for 30 to 45 seconds in a rehearsal.
const drainPeriod = 60;

// Covers canary delivery, the longest consumer timeout and metric publication.
const quietPeriod = 5 * 60;

function chunkArray<T>(array: T[], chunkSize: number) {
  return array.reduce(
    (chunks, item, index) => [
      ...chunks.slice(0, Math.floor(index / chunkSize)),
      [...(chunks[Math.floor(index / chunkSize)] || []), item],
      ...chunks.slice(Math.floor(index / chunkSize) + 1),
    ],
    [] as T[][],
  );
}

async function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, process.env.NODE_ENV === 'test' ? 0 : ms);
  });
}

async function write(
  target: string,
  requests: WriteRequest[],
  attempt = 1,
): Promise<void> {
  const command = new BatchWriteItemCommand({
    RequestItems: {
      [target]: requests,
    },
  });

  const { UnprocessedItems } = await client.send(command);

  const unprocessed = UnprocessedItems?.[target] ?? [];

  if (unprocessed.length === 0) {
    return;
  }

  if (attempt === 5) {
    throw new Error(`Unable to write ${unprocessed.length} items to ${target}`);
  }

  await sleep(2 ** attempt * 100);

  await write(target, unprocessed, attempt + 1);
}

async function clear(
  target: string,
  exclusiveStartKey?: Record<string, AttributeValue>,
) {
  const scan = new ScanCommand({
    ExclusiveStartKey: exclusiveStartKey,
    TableName: target,
  });

  const { Items, LastEvaluatedKey } = await client.send(scan);

  logger.info(`Found ${Items?.length ?? 0} items to clear`);

  if (Items && Items.length > 0) {
    const batches = chunkArray(Items, 25);

    await Promise.all(
      batches.map((batch) =>
        write(
          target,
          batch.map((item) => ({
            DeleteRequest: {
              Key: {
                // eslint-disable-next-line no-underscore-dangle
                __typename: item.__typename,
                id: item.id,
              },
            },
          })),
        ),
      ),
    );

    logger.info('All data cleared');
  }

  if (LastEvaluatedKey) {
    await clear(target, LastEvaluatedKey);
  }
}

async function restore(
  source: string,
  target: string,
  exclusiveStartKey?: Record<string, AttributeValue>,
) {
  const scan = new ScanCommand({
    ExclusiveStartKey: exclusiveStartKey,
    TableName: source,
  });

  const { Items, LastEvaluatedKey } = await client.send(scan);

  logger.info(`Found ${Items?.length ?? 0} items to restore`);

  if (Items && Items.length > 0) {
    const items = Items.map((item) => unmarshall(item));

    logger.info('Successfully unmarshalled data');

    const batches = chunkArray(items, 25);

    await Promise.all(
      batches.map(async (batch, index) => {
        try {
          await write(
            target,
            batch.map((item) => ({
              PutRequest: {
                Item: marshall(item),
              },
            })),
          );

          logger.info(
            `Batch ${index + 1} of ${batches.length} processed successfully`,
          );
        } catch (e) {
          logger.debug(`Batch content: ${JSON.stringify(batch)}`);

          logger.error(
            `Error processing batch ${index + 1} of ${batches.length}`,
            e,
          );

          throw e;
        }
      }),
    );
  }

  if (LastEvaluatedKey) {
    await restore(source, target, LastEvaluatedKey);

    return;
  }

  logger.info('All data restored');
}

async function settle(uuid: string, state: string): Promise<void> {
  const get = new GetEventSourceMappingCommand({
    UUID: uuid,
  });

  const { State } = await lambda.send(get);

  if (State === state) {
    return;
  }

  await sleep(5000);

  await settle(uuid, state);
}

async function consumers(target: string) {
  const describe = new DescribeTableCommand({
    TableName: target,
  });

  const { Table } = await client.send(describe);

  if (!Table?.LatestStreamArn) {
    throw new Error(`${target} has no stream`);
  }

  const list = new ListEventSourceMappingsCommand({
    EventSourceArn: Table.LatestStreamArn,
  });

  const { EventSourceMappings = [], NextMarker } = await lambda.send(list);

  if (NextMarker) {
    throw new Error(`Too many event source mappings found for ${target}`);
  }

  if (EventSourceMappings.length === 0) {
    throw new Error(`No event source mappings found for ${target}`);
  }

  async function update(
    mappings: EventSourceMappingConfiguration[],
    changes: Pick<
      UpdateEventSourceMappingCommandInput,
      'Enabled' | 'MaximumRecordAgeInSeconds'
    >,
    state: string,
  ) {
    await Promise.all(
      mappings.map(async ({ UUID }) => {
        const command = new UpdateEventSourceMappingCommand({
          ...changes,
          UUID,
        });

        await lambda.send(command);

        await settle(UUID as string, state);
      }),
    );
  }

  async function pause() {
    logger.info('Pausing target table consumers');

    await update(
      EventSourceMappings.filter(({ State }) => State !== 'Disabled'),
      {
        Enabled: false,
      },
      'Disabled',
    );

    logger.info('Target table consumers paused');

    await sleep(drainPeriod * 1000);

    // A Disabled mapping can still deliver records, so prove quiet with a canary.
    const start = new Date();

    start.setUTCSeconds(0, 0);

    await client.send(
      new PutItemCommand({
        Item: marshall({
          __typename: 'DataRestoreCanary',
          id: new Date().toISOString(),
        }),
        TableName: target,
      }),
    );

    logger.info('Waiting for target table consumers to stay quiet');

    await sleep(quietPeriod * 1000);

    const { MetricDataResults = [], NextToken } = await cloudwatch.send(
      new GetMetricDataCommand({
        EndTime: new Date(),
        MetricDataQueries: EventSourceMappings.map(
          ({ FunctionArn }, index) => ({
            Id: `consumer${index}`,
            MetricStat: {
              Metric: {
                Dimensions: [
                  {
                    Name: 'FunctionName',
                    Value: FunctionArn?.split(':')[6],
                  },
                ],
                MetricName: 'Invocations',
                Namespace: 'AWS/Lambda',
              },
              Period: 60,
              Stat: 'Sum',
            },
          }),
        ),
        StartTime: start,
      }),
    );

    const complete = EventSourceMappings.every((_, index) =>
      MetricDataResults.some(
        ({ Id, StatusCode }) =>
          Id === `consumer${index}` && StatusCode === 'Complete',
      ),
    );

    if (NextToken || !complete) {
      throw new Error(
        'Unable to read every consumer invocation count. Run restore again',
      );
    }

    const invocations = MetricDataResults.flatMap(
      ({ Values = [] }) => Values,
    ).reduce((total, value) => total + value, 0);

    if (invocations > 0) {
      throw new Error(
        `Target table consumers were invoked ${invocations} times after pausing. Run restore again`,
      );
    }

    logger.info('Target table consumers are quiet');
  }

  async function resume() {
    logger.info('Resuming target table consumers');

    await sleep(maximumRecordAge * 2 * 1000);

    await update(
      EventSourceMappings,
      {
        Enabled: true,
        MaximumRecordAgeInSeconds: maximumRecordAge,
      },
      'Enabled',
    );

    logger.info('Target table consumers resumed');
  }

  async function release() {
    if (EventSourceMappings.some(({ State }) => State !== 'Enabled')) {
      throw new Error('Resume target table consumers before releasing them');
    }

    logger.info('Releasing target table consumers');

    await update(
      EventSourceMappings,
      {
        MaximumRecordAgeInSeconds: -1,
      },
      'Enabled',
    );

    logger.info('Target table consumers released');
  }

  return {
    pause,
    release,
    resume,
  };
}

export const handler: Handler<{ action?: string } | null> = async (event) => {
  const { SOURCE, TARGET } = process.env;

  if (!SOURCE || !TARGET) {
    throw new Error('Missing source or target table');
  }

  const action = event?.action;

  if (action !== 'restore' && action !== 'resume' && action !== 'release') {
    throw new Error(`Unknown action: ${action}`);
  }

  const { pause, release, resume } = await consumers(TARGET);

  if (action === 'resume') {
    await resume();

    return;
  }

  if (action === 'release') {
    await release();

    return;
  }

  await pause();

  try {
    await clear(TARGET);

    await restore(SOURCE, TARGET);
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.message);
    }

    throw e;
  }

  logger.info('Process complete');
};
