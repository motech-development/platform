import {
  BatchWriteItemCommand,
  DynamoDBClient,
  ScanCommand,
  StreamViewType,
  UpdateTableCommand,
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

async function clear(target: string) {
  const scan = new ScanCommand({
    TableName: target,
  });

  const { Items } = await client.send(scan);

  logger.info(`Found ${Items?.length ?? 0} items to clear`);

  if (Items && Items.length > 0) {
    const batches = chunkArray(Items, 25);

    await Promise.all(
      batches.map((batch) => {
        const write = new BatchWriteItemCommand({
          RequestItems: {
            [target]: batch.map((item) => ({
              DeleteRequest: {
                Key: {
                  // eslint-disable-next-line no-underscore-dangle
                  __typename: item.__typename,
                  id: item.id,
                },
              },
            })),
          },
        });

        return client.send(write);
      }),
    );

    logger.info('All data cleared');
  }
}

async function restore(source: string, target: string) {
  const scan = new ScanCommand({
    TableName: source,
  });

  const { Items } = await client.send(scan);

  logger.info(`Found ${Items?.length ?? 0} items to restore`);

  if (Items && Items.length > 0) {
    const items = Items.map((item) => unmarshall(item));

    logger.info('Successfully unmarshalled data');

    const batches = chunkArray(items, 25);

    await Promise.all(
      batches.map(async (batch, index) => {
        try {
          const write = new BatchWriteItemCommand({
            RequestItems: {
              [target]: batch.map((item) => ({
                PutRequest: {
                  Item: marshall(item),
                },
              })),
            },
          });

          await client.send(write);

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

  logger.info('All data restored');
}

async function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, process.env.NODE_ENV === 'test' ? 0 : ms);
  });
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

  try {
    await disable();

    await clear(TARGET);

    await restore(SOURCE, TARGET);

    await sleep(120000);

    await enable();
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.message);
    }
  } finally {
    logger.info('Process complete');
  }
};
