import {
  AttributeValue,
  BatchWriteItemCommand,
  DynamoDBClient,
  ScanCommand,
  StreamViewType,
  UpdateTableCommand,
  WriteRequest,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import logger from '@motech-development/node-logger';
import type { Handler } from 'aws-lambda';

const client = new DynamoDBClient({});

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

function streams(target: string) {
  async function disable() {
    logger.info('Disabling target table streams');

    const update = new UpdateTableCommand({
      StreamSpecification: {
        StreamEnabled: false,
      },
      TableName: target,
    });

    await client.send(update);

    logger.info('Target table streams disabled');
  }

  async function enable() {
    logger.info('Re-enabling target table streams');

    const update = new UpdateTableCommand({
      StreamSpecification: {
        StreamEnabled: true,
        StreamViewType: StreamViewType.NEW_AND_OLD_IMAGES,
      },
      TableName: target,
    });

    await client.send(update);

    logger.info('Target table streams re-enabled');
  }

  return {
    disable,
    enable,
  };
}

export const handler: Handler = async () => {
  const { SOURCE, TARGET } = process.env;

  if (!SOURCE || !TARGET) {
    throw new Error('Missing source or target table');
  }

  const { disable, enable } = streams(TARGET);

  await disable();

  try {
    await clear(TARGET);

    await restore(SOURCE, TARGET);
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.message);
    }

    throw e;
  } finally {
    await sleep(120000);

    await enable();

    logger.info('Process complete');
  }
};
