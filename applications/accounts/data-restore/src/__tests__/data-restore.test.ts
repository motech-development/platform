import {
  CloudWatchClient,
  GetMetricDataCommand,
  GetMetricDataOutput,
} from '@aws-sdk/client-cloudwatch';
import {
  BatchWriteItemCommand,
  DescribeTableCommand,
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
  UpdateTableCommand,
} from '@aws-sdk/client-dynamodb';
import {
  GetEventSourceMappingCommand,
  LambdaClient,
  ListEventSourceMappingsCommand,
  UpdateEventSourceMappingCommand,
} from '@aws-sdk/client-lambda';
import logger from '@motech-development/node-logger';
import type { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import type { Mock } from 'vitest';
import { handler } from '../data-restore';

vi.mock('@motech-development/node-logger');

describe('data-restore', () => {
  let callback: Mock;
  let cloudwatch: AwsClientStub<CloudWatchClient>;
  let context: Context;
  let ddb: AwsClientStub<DynamoDBClient>;
  let lambda: AwsClientStub<LambdaClient>;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = vi.fn();

    cloudwatch = mockClient(CloudWatchClient);

    ddb = mockClient(DynamoDBClient);

    lambda = mockClient(LambdaClient);
  });

  it('should throw an error if source is missing', async () => {
    await expect(handler(null, context, callback)).rejects.toThrow(
      'Missing source or target table',
    );
  });

  describe('when source is set', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.SOURCE = 'source-table';

      cloudwatch.reset();

      ddb.reset();

      lambda.reset();
    });

    afterEach(() => {
      process.env = env;
    });

    it('should throw an error if source is missing', async () => {
      await expect(handler(null, context, callback)).rejects.toThrow(
        'Missing source or target table',
      );
    });

    describe('when target is set', () => {
      beforeEach(() => {
        process.env.SOURCE = 'source-table';
        process.env.TARGET = 'target-table';

        cloudwatch.on(GetMetricDataCommand).resolves({
          MetricDataResults: [
            {
              Id: 'consumer0',
              StatusCode: 'Complete',
              Values: [0],
            },
            {
              Id: 'consumer1',
              StatusCode: 'Complete',
              Values: [],
            },
          ],
        });

        ddb
          .on(DescribeTableCommand)
          .resolves({
            Table: {
              LatestStreamArn: 'stream-arn',
            },
          })
          .on(PutItemCommand)
          .resolves({});

        lambda
          .on(ListEventSourceMappingsCommand, {
            EventSourceArn: 'stream-arn',
          })
          .resolves({
            EventSourceMappings: [
              {
                FunctionArn:
                  'arn:aws:lambda:eu-west-1:123456789012:function:enabled-consumer',
                State: 'Enabled',
                UUID: 'enabled-mapping',
              },
              {
                FunctionArn:
                  'arn:aws:lambda:eu-west-1:123456789012:function:disabled-consumer',
                State: 'Disabled',
                UUID: 'disabled-mapping',
              },
            ],
          })
          .on(GetEventSourceMappingCommand)
          .resolves({
            State: 'Disabled',
          })
          .on(UpdateEventSourceMappingCommand)
          .resolves({});
      });

      afterEach(() => {
        process.env = env;
      });

      it('should clear the target table and restore data from the source table', async () => {
        const items = Array.from({ length: 50 }, (_, i) => ({
          data: {
            S: `data${i + 1}`,
          },
          id: {
            S: `${i + 1}`,
          },
        }));

        ddb
          .on(ScanCommand, {
            TableName: 'target-table',
          })
          .resolves({
            Items: items,
          })
          .on(ScanCommand, {
            TableName: 'source-table',
          })
          .resolves({
            Items: items,
          })
          .on(BatchWriteItemCommand)
          .resolves({});

        await handler({ action: 'restore' }, context, callback);

        expect(ddb).toHaveReceivedCommandTimes(ScanCommand, 2);

        expect(ddb).toHaveReceivedCommandTimes(BatchWriteItemCommand, 4);
      });

      it('should clear the target table and restore data from the source table when chunking threshold is not reached', async () => {
        const items = Array.from({ length: 10 }, (_, i) => ({
          data: {
            S: `data${i + 1}`,
          },
          id: {
            S: `${i + 1}`,
          },
        }));

        ddb
          .on(ScanCommand, {
            TableName: 'target-table',
          })
          .resolves({
            Items: items,
          })
          .on(ScanCommand, {
            TableName: 'source-table',
          })
          .resolves({
            Items: items,
          })
          .on(BatchWriteItemCommand)
          .resolves({});

        await handler({ action: 'restore' }, context, callback);

        expect(ddb).toHaveReceivedCommandTimes(ScanCommand, 2);

        expect(ddb).toHaveReceivedCommandTimes(BatchWriteItemCommand, 2);
      });

      it('should log an error if an exception is thrown', async () => {
        const error = new Error('Test error');

        ddb.on(ScanCommand).rejects(error);

        await expect(
          handler({ action: 'restore' }, context, callback),
        ).rejects.toThrow(error);

        expect(logger.error).toHaveBeenCalledWith(error.message);

        expect(lambda).not.toReceiveCommandWith(
          UpdateEventSourceMappingCommand,
          {
            Enabled: true,
          },
        );
      });

      it('should log an error if restore has en error', async () => {
        const error = new Error('Test error');

        const items = Array.from({ length: 10 }, (_, i) => ({
          data: {
            S: `data${i + 1}`,
          },
          id: {
            S: `${i + 1}`,
          },
        }));

        ddb
          .on(ScanCommand, {
            TableName: 'target-table',
          })
          .resolves({
            Items: items,
          })
          .on(ScanCommand, {
            TableName: 'source-table',
          })
          .resolves({
            Items: items,
          })
          .on(BatchWriteItemCommand)
          .resolvesOnce({})
          .rejectsOnce(error);

        await expect(
          handler({ action: 'restore' }, context, callback),
        ).rejects.toThrow(error);

        expect(logger.error).toHaveBeenCalledWith(
          'Error processing batch 1 of 1',
          error,
        );
      });

      it('should clear and restore every page of the tables', async () => {
        const item = {
          __typename: {
            S: 'Transaction',
          },
          id: {
            S: '1',
          },
        };

        ddb
          .on(ScanCommand)
          .resolvesOnce({
            Items: [item],
            LastEvaluatedKey: item,
          })
          .resolvesOnce({
            Items: [item],
          })
          .resolvesOnce({
            Items: [item],
            LastEvaluatedKey: item,
          })
          .resolvesOnce({
            Items: [item],
          })
          .on(BatchWriteItemCommand)
          .resolves({});

        await handler({ action: 'restore' }, context, callback);

        expect(ddb).toReceiveCommandWith(ScanCommand, {
          ExclusiveStartKey: item,
          TableName: 'target-table',
        });

        expect(ddb).toReceiveCommandWith(ScanCommand, {
          ExclusiveStartKey: item,
          TableName: 'source-table',
        });

        expect(ddb).toReceiveCommandTimes(BatchWriteItemCommand, 4);
      });

      describe('when items are left unprocessed', () => {
        const request = {
          DeleteRequest: {
            Key: {
              __typename: {
                S: 'Transaction',
              },
              id: {
                S: '1',
              },
            },
          },
        };

        beforeEach(() => {
          ddb
            .on(ScanCommand, {
              TableName: 'target-table',
            })
            .resolves({
              Items: [request.DeleteRequest.Key],
            })
            .on(ScanCommand, {
              TableName: 'source-table',
            })
            .resolves({
              Items: [],
            });
        });

        it('should retry the unprocessed items', async () => {
          ddb
            .on(BatchWriteItemCommand)
            .resolvesOnce({
              UnprocessedItems: {
                'target-table': [request],
              },
            })
            .resolves({});

          await handler({ action: 'restore' }, context, callback);

          expect(ddb).toReceiveNthCommandWith(BatchWriteItemCommand, 2, {
            RequestItems: {
              'target-table': [request],
            },
          });
        });

        it('should throw if items remain unprocessed after retrying', async () => {
          ddb.on(BatchWriteItemCommand).resolves({
            UnprocessedItems: {
              'target-table': [request],
            },
          });

          await expect(
            handler({ action: 'restore' }, context, callback),
          ).rejects.toThrow('Unable to write 1 items to target-table');

          expect(ddb).toReceiveCommandTimes(BatchWriteItemCommand, 5);
        });
      });

      it.each([[null], [{}], [{ action: 'unknown' }]])(
        'should throw without touching any table when the action is %j',
        async (event) => {
          await expect(handler(event, context, callback)).rejects.toThrow(
            'Unknown action',
          );

          expect(ddb).not.toHaveReceivedAnyCommand();

          expect(lambda).not.toHaveReceivedAnyCommand();
        },
      );

      it('should throw if the target table has no stream', async () => {
        ddb.on(DescribeTableCommand).resolves({
          Table: {},
        });

        await expect(
          handler({ action: 'restore' }, context, callback),
        ).rejects.toThrow('target-table has no stream');

        expect(lambda).not.toHaveReceivedAnyCommand();
      });

      it('should throw without clearing if the target table has no consumers', async () => {
        lambda.on(ListEventSourceMappingsCommand).resolves({
          EventSourceMappings: [],
        });

        await expect(
          handler({ action: 'restore' }, context, callback),
        ).rejects.toThrow('No event source mappings found for target-table');

        expect(ddb).not.toHaveReceivedCommand(ScanCommand);
      });

      it('should throw without pausing or clearing if the consumers span more than one page', async () => {
        lambda.on(ListEventSourceMappingsCommand).resolves({
          EventSourceMappings: [
            {
              State: 'Enabled',
              UUID: 'enabled-mapping',
            },
          ],
          NextMarker: 'next-page',
        });

        await expect(
          handler({ action: 'restore' }, context, callback),
        ).rejects.toThrow(
          'Too many event source mappings found for target-table',
        );

        expect(lambda).not.toHaveReceivedCommand(
          UpdateEventSourceMappingCommand,
        );

        expect(ddb).not.toHaveReceivedCommand(ScanCommand);
      });

      describe('when restoring', () => {
        beforeEach(() => {
          ddb
            .on(ScanCommand)
            .resolves({
              Items: [
                {
                  __typename: {
                    S: 'Transaction',
                  },
                  id: {
                    S: '1',
                  },
                },
              ],
            })
            .on(BatchWriteItemCommand)
            .resolves({});
        });

        it('should pause the enabled consumers without touching the stream', async () => {
          await handler({ action: 'restore' }, context, callback);

          expect(lambda).toHaveReceivedCommandTimes(
            UpdateEventSourceMappingCommand,
            1,
          );

          expect(lambda).toHaveReceivedCommandWith(
            UpdateEventSourceMappingCommand,
            {
              Enabled: false,
              UUID: 'enabled-mapping',
            },
          );

          expect(ddb).not.toHaveReceivedCommand(UpdateTableCommand);
        });

        it('should wait for the consumers to be disabled before writing', async () => {
          lambda
            .on(GetEventSourceMappingCommand)
            .resolvesOnce({
              State: 'Disabling',
            })
            .resolves({
              State: 'Disabled',
            });

          await handler({ action: 'restore' }, context, callback);

          const [, disabled] = lambda.commandCalls(
            GetEventSourceMappingCommand,
          );

          const [write] = ddb.commandCalls(BatchWriteItemCommand);

          expect(disabled.calledBefore(write)).toBe(true);
        });

        it('should check every consumer stayed quiet after a canary write before clearing', async () => {
          await handler({ action: 'restore' }, context, callback);

          const [canary] = ddb.commandCalls(PutItemCommand);

          expect(canary.args[0].input).toMatchObject({
            Item: {
              __typename: {
                S: 'DataRestoreCanary',
              },
            },
            TableName: 'target-table',
          });

          const [check] = cloudwatch.commandCalls(GetMetricDataCommand);

          expect(
            check.args[0].input.MetricDataQueries?.map(
              ({ MetricStat }) => MetricStat?.Metric,
            ),
          ).toEqual(
            ['enabled-consumer', 'disabled-consumer'].map((name) => ({
              Dimensions: [
                {
                  Name: 'FunctionName',
                  Value: name,
                },
              ],
              MetricName: 'Invocations',
              Namespace: 'AWS/Lambda',
            })),
          );

          const [scan] = ddb.commandCalls(ScanCommand);

          expect(canary.calledBefore(check)).toBe(true);

          expect(check.calledBefore(scan)).toBe(true);
        });

        it('should refuse to clear if a consumer was invoked after pausing', async () => {
          cloudwatch.on(GetMetricDataCommand).resolves({
            MetricDataResults: [
              {
                Id: 'consumer0',
                StatusCode: 'Complete',
                Values: [0],
              },
              {
                Id: 'consumer1',
                StatusCode: 'Complete',
                Values: [2, 1],
              },
            ],
          });

          await expect(
            handler({ action: 'restore' }, context, callback),
          ).rejects.toThrow(
            'Target table consumers were invoked 3 times after pausing',
          );

          expect(ddb).not.toHaveReceivedCommand(ScanCommand);

          expect(ddb).not.toHaveReceivedCommand(BatchWriteItemCommand);
        });

        it.each([
          [
            'a result is incomplete',
            {
              MetricDataResults: [
                {
                  Id: 'consumer0',
                  StatusCode: 'Complete',
                  Values: [],
                },
                {
                  Id: 'consumer1',
                  StatusCode: 'PartialData',
                  Values: [],
                },
              ],
            },
          ],
          [
            'a result is missing',
            {
              MetricDataResults: [
                {
                  Id: 'consumer0',
                  StatusCode: 'Complete',
                  Values: [],
                },
              ],
            },
          ],
          [
            'there are more results',
            {
              MetricDataResults: [
                {
                  Id: 'consumer0',
                  StatusCode: 'Complete',
                  Values: [],
                },
                {
                  Id: 'consumer1',
                  StatusCode: 'Complete',
                  Values: [],
                },
              ],
              NextToken: 'next-page',
            },
          ],
        ] as [string, GetMetricDataOutput][])(
          'should refuse to clear if %s',
          async (_, output) => {
            cloudwatch.on(GetMetricDataCommand).resolves(output);

            await expect(
              handler({ action: 'restore' }, context, callback),
            ).rejects.toThrow('Unable to read every consumer invocation count');

            expect(ddb).not.toHaveReceivedCommand(ScanCommand);
          },
        );
      });

      describe('when resuming', () => {
        it('should enable every consumer and skip records older than a minute', async () => {
          lambda.on(GetEventSourceMappingCommand).resolves({
            State: 'Enabled',
          });

          await handler({ action: 'resume' }, context, callback);

          ['enabled-mapping', 'disabled-mapping'].forEach((UUID) => {
            expect(lambda).toHaveReceivedCommandWith(
              UpdateEventSourceMappingCommand,
              {
                Enabled: true,
                MaximumRecordAgeInSeconds: 60,
                UUID,
              },
            );
          });

          expect(ddb).not.toHaveReceivedCommand(ScanCommand);
        });
      });

      describe('when releasing', () => {
        it('should refuse while any consumer is not enabled', async () => {
          await expect(
            handler({ action: 'release' }, context, callback),
          ).rejects.toThrow(
            'Resume target table consumers before releasing them',
          );

          expect(lambda).not.toHaveReceivedCommand(
            UpdateEventSourceMappingCommand,
          );
        });

        it('should restore the default record age on every consumer', async () => {
          lambda
            .on(ListEventSourceMappingsCommand)
            .resolves({
              EventSourceMappings: [
                {
                  State: 'Enabled',
                  UUID: 'first-mapping',
                },
                {
                  State: 'Enabled',
                  UUID: 'second-mapping',
                },
              ],
            })
            .on(GetEventSourceMappingCommand)
            .resolves({
              State: 'Enabled',
            });

          await handler({ action: 'release' }, context, callback);

          ['first-mapping', 'second-mapping'].forEach((UUID) => {
            expect(lambda).toHaveReceivedCommandWith(
              UpdateEventSourceMappingCommand,
              {
                MaximumRecordAgeInSeconds: -1,
                UUID,
              },
            );
          });
        });
      });
    });
  });
});
