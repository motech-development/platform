import {
  type AttributeDefinition,
  BatchWriteItemCommand,
  type BatchWriteItemCommandInput,
  DescribeTableCommand,
  type DescribeTableCommandInput,
  DynamoDBClient,
  type KeySchemaElement,
  ScanCommand,
  type ScanCommandInput,
  type ScanCommandOutput,
  StreamViewType,
  UpdateTableCommand,
  type UpdateTableCommandInput,
} from '@aws-sdk/client-dynamodb';
import {
  LambdaClient,
  ListEventSourceMappingsCommand,
} from '@aws-sdk/client-lambda';
import type { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import type { Mock } from 'vitest';
import { handler } from '../data-restore';

vi.mock('@motech-development/node-logger');

const SOURCE = 'source-table';
const TARGET = 'target-table';
const TARGET_ARN = `arn:aws:dynamodb:eu-west-1:123456789012:table/${TARGET}`;

const item = (id: string) => ({
  __typename: {
    S: 'Transaction',
  },
  amount: {
    N: '9007199254740993',
  },
  attachmentData: {
    B: new Uint8Array([1, 2, 3]),
  },
  id: {
    S: id,
  },
});

describe('data-restore', () => {
  let callback: Mock;
  let context: Context;
  let ddb: AwsClientStub<DynamoDBClient>;
  let lambda: AwsClientStub<LambdaClient>;
  let targetStreamEnabled: boolean;
  let targetStreamViewType: StreamViewType | undefined;
  let targetTableUpdating: boolean;
  let failStreamDisableTransition: boolean;
  let streamUpdateCount: number;
  let streamTransitionDescribeCount: number;
  let scanPages: Record<string, unknown[]>;
  let sourceAndTargetShareTableArn: boolean;
  let keySchema: KeySchemaElement[];
  let targetKeySchema: KeySchemaElement[] | undefined;
  let targetAttributeDefinitions: AttributeDefinition[] | undefined;
  const attributeDefinitions: AttributeDefinition[] = [
    {
      AttributeName: 'id',
      AttributeType: 'S',
    },
    {
      AttributeName: '__typename',
      AttributeType: 'S',
    },
  ];

  beforeEach(() => {
    context = ctx({
      timeout: 900,
    });
    context.done();
    callback = vi.fn();

    ddb = mockClient(DynamoDBClient);
    lambda = mockClient(LambdaClient);
    ddb.reset();
    lambda.reset();

    process.env.SOURCE = SOURCE;
    process.env.TARGET = TARGET;

    targetStreamEnabled = true;
    targetStreamViewType = StreamViewType.NEW_IMAGE;
    targetTableUpdating = false;
    failStreamDisableTransition = false;
    streamUpdateCount = 0;
    streamTransitionDescribeCount = 0;
    scanPages = {};
    sourceAndTargetShareTableArn = false;
    keySchema = [
      {
        AttributeName: 'id',
        KeyType: 'HASH',
      },
      {
        AttributeName: '__typename',
        KeyType: 'RANGE',
      },
    ];
    targetKeySchema = undefined;
    targetAttributeDefinitions = undefined;

    ddb
      .on(DescribeTableCommand)
      .callsFake(({ TableName }: DescribeTableCommandInput) => {
        const isTarget = TableName === TARGET;
        const alternatingTransition =
          isTarget && failStreamDisableTransition && streamUpdateCount === 1;
        let TableStatus = 'ACTIVE';

        if (alternatingTransition) {
          TableStatus =
            streamTransitionDescribeCount % 2 === 0 ? 'UPDATING' : 'ACTIVE';
          streamTransitionDescribeCount += 1;
        } else if (isTarget && targetTableUpdating) {
          TableStatus = 'UPDATING';
        }

        if (isTarget && targetTableUpdating) {
          targetTableUpdating = false;
        }

        return {
          Table: {
            AttributeDefinitions: isTarget
              ? targetAttributeDefinitions ?? attributeDefinitions
              : attributeDefinitions,
            KeySchema:
              isTarget && targetKeySchema ? targetKeySchema : keySchema,
            TableArn:
              isTarget || sourceAndTargetShareTableArn
                ? TARGET_ARN
                : `arn:aws:dynamodb:eu-west-1:123456789012:table/${SOURCE}`,
            TableName,
            TableStatus,
            ...(isTarget && targetStreamEnabled
              ? {
                  StreamSpecification: {
                    StreamEnabled: true,
                    StreamViewType: targetStreamViewType,
                  },
                }
              : {}),
          },
        };
      });

    ddb.on(ScanCommand).callsFake(({ TableName }: ScanCommandInput) => {
      const pages = scanPages[TableName ?? ''];

      return (pages?.shift() ?? {
        Items: [],
      }) as ScanCommandOutput;
    });

    ddb
      .on(UpdateTableCommand)
      .callsFake(({ StreamSpecification }: UpdateTableCommandInput) => {
        streamUpdateCount += 1;

        if (!(failStreamDisableTransition && streamUpdateCount === 1)) {
          targetStreamEnabled = StreamSpecification?.StreamEnabled === true;
          targetStreamViewType =
            StreamSpecification?.StreamViewType ?? targetStreamViewType;
        }

        targetTableUpdating = true;

        return {};
      });

    ddb.on(BatchWriteItemCommand).resolves({});
    lambda.on(ListEventSourceMappingsCommand).resolves({
      EventSourceMappings: [],
    });
  });

  afterEach(() => {
    delete process.env.SOURCE;
    delete process.env.TARGET;
    vi.restoreAllMocks();
  });

  it('throws when source or target configuration is missing', async () => {
    delete process.env.TARGET;

    await expect(handler(null, context, callback)).rejects.toThrow(
      'Missing source or target table',
    );
  });

  it('rejects the same source and target before scanning or changing streams', async () => {
    process.env.TARGET = SOURCE;

    await expect(handler(null, context, callback)).rejects.toThrow(
      'Source and target tables must be different',
    );

    expect(ddb).toHaveReceivedCommandTimes(DescribeTableCommand, 0);
    expect(ddb).toHaveReceivedCommandTimes(ScanCommand, 0);
  });

  it('rejects different table names that resolve to the same ARN', async () => {
    sourceAndTargetShareTableArn = true;

    await expect(handler(null, context, callback)).rejects.toThrow(
      'Source and target tables must be different',
    );

    expect(ddb).toHaveReceivedCommandTimes(DescribeTableCommand, 2);
    expect(lambda).toHaveReceivedCommandTimes(
      ListEventSourceMappingsCommand,
      0,
    );
    expect(ddb).toHaveReceivedCommandTimes(ScanCommand, 0);
    expect(ddb).toHaveReceivedCommandTimes(UpdateTableCommand, 0);
  });

  const invalidKeySchemas: KeySchemaElement[][] = [
    [
      {
        AttributeName: 'id',
        KeyType: 'HASH',
      },
      {
        AttributeName: 'id',
        KeyType: 'RANGE',
      },
    ],
    [
      {
        KeyType: 'HASH',
      } as unknown as KeySchemaElement,
      {
        AttributeName: 'id',
        KeyType: 'RANGE',
      },
    ],
  ];

  it.each(invalidKeySchemas.map((invalidSchema) => ({ invalidSchema })))(
    'rejects invalid key attribute names',
    async ({ invalidSchema }) => {
      keySchema = invalidSchema;

      await expect(handler(null, context, callback)).rejects.toThrow(
        'Source and target tables must use matching __typename and id key schemas and attribute types',
      );

      expect(lambda).toHaveReceivedCommandTimes(
        ListEventSourceMappingsCommand,
        0,
      );
      expect(ddb).toHaveReceivedCommandTimes(ScanCommand, 0);
      expect(ddb).toHaveReceivedCommandTimes(UpdateTableCommand, 0);
    },
  );

  it('rejects mismatched key attribute types before clearing the target', async () => {
    targetAttributeDefinitions = [
      {
        AttributeName: 'id',
        AttributeType: 'N',
      },
      {
        AttributeName: '__typename',
        AttributeType: 'S',
      },
    ];

    await expect(handler(null, context, callback)).rejects.toThrow(
      'Source and target tables must use matching __typename and id key schemas and attribute types',
    );

    expect(ddb).toHaveReceivedCommandTimes(ScanCommand, 0);
    expect(ddb).toHaveReceivedCommandTimes(UpdateTableCommand, 0);
  });

  it('rejects mismatched key roles before clearing the target', async () => {
    targetKeySchema = [
      {
        AttributeName: 'id',
        KeyType: 'RANGE',
      },
      {
        AttributeName: '__typename',
        KeyType: 'HASH',
      },
    ];

    await expect(handler(null, context, callback)).rejects.toThrow(
      'Source and target tables must use matching __typename and id key schemas and attribute types',
    );

    expect(ddb).toHaveReceivedCommandTimes(ScanCommand, 0);
    expect(ddb).toHaveReceivedCommandTimes(UpdateTableCommand, 0);
  });

  it('does not disable streams when the Lambda is too close to its timeout', async () => {
    context = ctx({
      timeout: 60,
    });

    await expect(handler(null, context, callback)).rejects.toThrow(
      'Insufficient execution time to safely change target table streams',
    );

    expect(ddb).toHaveReceivedCommandTimes(UpdateTableCommand, 0);
    expect(ddb).toHaveReceivedCommandTimes(ScanCommand, 0);
  });

  it('bounds a stream transition when table status and stream state alternate', async () => {
    failStreamDisableTransition = true;

    await expect(handler(null, context, callback)).rejects.toThrow(
      'Timed out waiting for target table stream to become disabled',
    );

    expect(streamTransitionDescribeCount).toBeLessThanOrEqual(62);
    expect(ddb).toHaveReceivedCommandTimes(ScanCommand, 0);
    expect(ddb).toHaveReceivedCommandTimes(UpdateTableCommand, 1);
  });

  it('consumes every scan page, including empty pages, retries unprocessed writes, and restores the stream view type', async () => {
    const continuation = {
      id: {
        S: 'page-one',
      },
    };
    const continuationAfterEmptyPage = {
      id: {
        S: 'page-two',
      },
    };
    const targetItems = Array.from({ length: 26 }, (_, index) =>
      item(`target-${index}`),
    );
    const sourceItems = Array.from({ length: 26 }, (_, index) =>
      item(`source-${index}`),
    );

    scanPages[TARGET] = [
      {
        Items: targetItems,
        LastEvaluatedKey: continuation,
      },
      {
        Items: [],
        LastEvaluatedKey: continuationAfterEmptyPage,
      },
      {
        Items: [item('target-final')],
        LastEvaluatedKey: {},
      },
    ];
    scanPages[SOURCE] = [
      {
        Items: sourceItems,
        LastEvaluatedKey: continuation,
      },
      {
        Items: [],
        LastEvaluatedKey: continuationAfterEmptyPage,
      },
      {
        Items: [item('source-final')],
        LastEvaluatedKey: {},
      },
    ];

    let batchRetried = false;
    ddb
      .on(BatchWriteItemCommand)
      .callsFake(({ RequestItems }: BatchWriteItemCommandInput) => {
        const [tableName] = Object.keys(RequestItems ?? {});
        const requests = RequestItems?.[tableName] ?? [];

        if (
          tableName === TARGET &&
          !batchRetried &&
          requests.length === 25 &&
          requests[0]?.PutRequest
        ) {
          batchRetried = true;

          return {
            UnprocessedItems: {
              [TARGET]: [requests[0]],
            },
          };
        }

        return {};
      });

    await expect(handler(null, context, callback)).resolves.toBeUndefined();

    const scans = ddb
      .commandCalls(ScanCommand)
      .map(({ args: [command] }) => command.input);
    expect(scans.filter(({ TableName }) => TableName === TARGET)).toHaveLength(
      3,
    );
    expect(scans.filter(({ TableName }) => TableName === SOURCE)).toHaveLength(
      3,
    );
    expect(scans.every(({ ConsistentRead }) => ConsistentRead)).toBe(true);
    expect(scans[1].ExclusiveStartKey).toEqual(continuation);
    expect(scans[2].ExclusiveStartKey).toEqual(continuationAfterEmptyPage);

    const writes = ddb
      .commandCalls(BatchWriteItemCommand)
      .map(({ args: [command] }) => command.input.RequestItems ?? {});
    expect(writes).toHaveLength(7);
    expect(
      writes.every((requestItems) =>
        Object.values(requestItems).every((requests) => requests.length <= 25),
      ),
    ).toBe(true);
    expect(writes.some((requestItems) => SOURCE in requestItems)).toBe(false);
    expect(writes.every((requestItems) => TARGET in requestItems)).toBe(true);
    expect(writes[4][TARGET]).toEqual([writes[3][TARGET][0]]);
    expect(writes[3][TARGET][0].PutRequest?.Item).toEqual(sourceItems[0]);

    const streamUpdates = ddb
      .commandCalls(UpdateTableCommand)
      .map(({ args: [command] }) => command.input.StreamSpecification);
    expect(streamUpdates).toEqual([
      {
        StreamEnabled: false,
      },
      {
        StreamEnabled: true,
        StreamViewType: StreamViewType.NEW_IMAGE,
      },
    ]);
    expect(targetStreamEnabled).toBe(true);
    expect(targetStreamViewType).toBe(StreamViewType.NEW_IMAGE);
  });

  it('refuses to restore when any current or old stream mapping remains attached', async () => {
    lambda
      .on(ListEventSourceMappingsCommand)
      .resolvesOnce({
        EventSourceMappings: [
          {
            EventSourceArn:
              'arn:aws:dynamodb:eu-west-1:123456789012:table/other/stream/latest',
            State: 'Enabled',
          },
        ],
        NextMarker: 'next-page',
      })
      .resolvesOnce({
        EventSourceMappings: [
          {
            EventSourceArn: `${TARGET_ARN}/stream/old-stream`,
            State: 'Disabled',
          },
        ],
      });

    await expect(handler(null, context, callback)).rejects.toThrow(
      'detach all target stream consumers before restoring',
    );

    expect(lambda).toHaveReceivedCommandTimes(
      ListEventSourceMappingsCommand,
      2,
    );
    expect(ddb).toHaveReceivedCommandTimes(ScanCommand, 0);
    expect(ddb).toHaveReceivedCommandTimes(UpdateTableCommand, 0);
  });

  it('propagates a restore failure after re-enabling the original stream', async () => {
    const error = new Error('Source scan failed');
    ddb
      .on(ScanCommand, {
        TableName: TARGET,
      })
      .resolvesOnce({
        Items: [item('target-item')],
      })
      .on(ScanCommand, {
        TableName: SOURCE,
      })
      .rejects(error);

    await expect(handler(null, context, callback)).rejects.toBe(error);

    const updates = ddb.commandCalls(UpdateTableCommand);
    expect(updates).toHaveLength(2);
    expect(updates[1].args[0].input.StreamSpecification).toEqual({
      StreamEnabled: true,
      StreamViewType: StreamViewType.NEW_IMAGE,
    });
  });

  it('throws when unprocessed writes remain after bounded retries and restores the stream', async () => {
    const unprocessed = {
      DeleteRequest: {
        Key: {
          __typename: {
            S: 'Transaction',
          },
          id: {
            S: 'still-pending',
          },
        },
      },
    };
    ddb
      .on(ScanCommand, {
        TableName: TARGET,
      })
      .resolves({
        Items: [item('still-pending')],
      })
      .on(BatchWriteItemCommand)
      .resolves({
        UnprocessedItems: {
          [TARGET]: [unprocessed],
        },
      });

    await expect(handler(null, context, callback)).rejects.toThrow(
      'left 1 write request(s) unprocessed after 5 attempts',
    );

    expect(ddb).toHaveReceivedCommandTimes(BatchWriteItemCommand, 5);
    expect(ddb).toHaveReceivedCommandTimes(UpdateTableCommand, 2);
    expect(targetStreamEnabled).toBe(true);
  });

  it('surfaces both the restore error and failed stream recovery', async () => {
    const restoreError = new Error('Source scan failed');
    const recoveryError = new Error('Stream update failed');
    ddb
      .on(ScanCommand, {
        TableName: TARGET,
      })
      .rejects(restoreError)
      .on(UpdateTableCommand)
      .callsFake(({ StreamSpecification }: UpdateTableCommandInput) => {
        if (StreamSpecification?.StreamEnabled === true) {
          throw recoveryError;
        }

        targetStreamEnabled = false;

        return {};
      });

    const result = handler(null, context, callback);

    await expect(result).rejects.toMatchObject({
      errors: [restoreError, recoveryError],
      message: 'Restore failed and stream recovery also failed',
    });
    expect(targetStreamEnabled).toBe(false);
  });

  it('leaves a stream that was originally disabled disabled', async () => {
    targetStreamEnabled = false;
    targetStreamViewType = undefined;

    await expect(handler(null, context, callback)).resolves.toBeUndefined();

    expect(ddb).toHaveReceivedCommandTimes(UpdateTableCommand, 0);
  });
});
