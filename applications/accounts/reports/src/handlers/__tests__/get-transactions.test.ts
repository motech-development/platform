import { Readable } from 'node:stream';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import type { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import type { Mock } from 'vitest';
import Status from '../../shared/status';
import { handler, IEvent } from '../get-transactions';

const reportStorage = vi.hoisted(() => ({
  downloadFileStream: vi.fn(),
  objects: [] as { body: string; bucket: string; key: string }[],
  uploader: vi.fn(),
}));

vi.mock('@motech-development/s3-file-operations', async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import('@motech-development/s3-file-operations')
    >();

  return {
    ...actual,
    downloadFileStream: reportStorage.downloadFileStream,
    uploader: reportStorage.uploader,
  };
});

const collectStream = (stream: Readable): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: string[] = [];

    stream.setEncoding('utf8');
    stream.on('data', (chunk: string) => chunks.push(chunk));
    stream.once('error', reject);
    stream.once('end', () => {
      resolve(chunks.join(''));
    });
  });

const parsePayload = (serialized: string): unknown =>
  JSON.parse(serialized) as unknown;

describe('get-transactions', () => {
  let callback: Mock;
  let context: Context;
  let ddb: AwsClientStub<DynamoDBClient>;
  let event: IEvent;

  beforeEach(() => {
    callback = vi.fn();

    ddb = mockClient(DynamoDBClient);
    reportStorage.objects = [];
    reportStorage.uploader.mockImplementation(
      (bucket: string, key: string, body: Readable) => ({
        done: async () => {
          reportStorage.objects.push({
            body: await collectStream(body),
            bucket,
            key,
          });
        },
      }),
    );

    ddb.on(QueryCommand).resolves({
      Items: [
        {
          amount: 1000,
          category: 'Sales',
          date: '08/04/2021',
          description: 'For work',
          name: 'Client',
          vat: 166.67,
        },
        {
          amount: 41.11,
          category: 'Bills',
          date: '09/04/2021',
          description: 'Mobile',
          name: 'EE',
          vat: 6.85,
        },
        {
          amount: 2.4,
          category: 'Bills',
          date: '10/04/2021',
          description: 'Domain',
          name: 'GoDaddy',
          vat: 0.4,
        },
      ],
    });

    context = ctx();

    context.done();

    event = {
      companyId: 'COMPANY-ID',
      currency: '£',
      owner: 'OWNER-ID',
      status: Status.Confirmed,
      year: 2020,
      yearEnd: {
        day: 5,
        month: 3,
      },
    };
  });

  it('should throw an error if no table is set', async () => {
    await expect(handler(event, context, callback)).rejects.toThrow(
      'No table set',
    );
  });

  describe('with table set', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.TABLE = 'TABLE-NAME';
      process.env.REPORT_BUCKET = 'REPORT-BUCKET';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should query DynamoDB with the correct params', async () => {
      await handler(event, context, callback);

      expect(ddb).toReceiveCommandWith(QueryCommand, {
        ExpressionAttributeNames: {
          '#data': 'data',
          '#owner': 'owner',
          '#typename': '__typename',
        },
        ExpressionAttributeValues: {
          ':lower': 'OWNER-ID:COMPANY-ID:confirmed:2020-04-06T00:00:00Z',
          ':owner': 'OWNER-ID',
          ':typename': 'Transaction',
          ':upper': 'OWNER-ID:COMPANY-ID:confirmed:2021-04-05T23:59:59Z',
        },
        FilterExpression: '#owner = :owner',
        IndexName: '__typename-data-index',
        KeyConditionExpression:
          '#typename = :typename AND #data BETWEEN :lower AND :upper',
        ScanIndexForward: false,
        TableName: 'TABLE-NAME',
      });
    });

    it('should store the paged results and return a bounded payload reference', async () => {
      const lastEvaluatedKey = {
        __typename: 'Transaction',
        data: 'OWNER-ID:COMPANY-ID:confirmed:next',
        id: 'last-id',
      };
      ddb
        .on(QueryCommand)
        .resolvesOnce({
          Items: [
            {
              amount: 1000,
              category: 'Sales',
              date: '08/04/2021',
              description: 'For work',
              name: 'Client',
              vat: 166.67,
            },
          ],
          LastEvaluatedKey: lastEvaluatedKey,
        })
        .resolves({
          Items: [
            {
              amount: 41.11,
              category: 'Bills',
              date: '09/04/2021',
              description: 'Mobile',
              name: 'EE',
              vat: 6.85,
            },
            {
              amount: 2.4,
              category: 'Bills',
              date: '10/04/2021',
              description: 'Domain',
              name: 'GoDaddy',
              vat: 0.4,
            },
          ],
        });

      const result = await handler(event, context, callback);

      if (!result) {
        throw new Error('Expected a report result');
      }

      expect(result).toMatchObject({
        companyId: 'COMPANY-ID',
        complete: false,
        currency: '£',
        owner: 'OWNER-ID',
      });
      expect(result.complete).toBe(false);
      if (result.complete) {
        throw new Error('Expected a report payload reference');
      }
      expect(result.payloadKey).toBeTypeOf('string');

      expect(ddb).toReceiveCommandTimes(QueryCommand, 2);
      expect(ddb).toReceiveCommandWith(QueryCommand, {
        ExclusiveStartKey: lastEvaluatedKey,
      });
      expect(reportStorage.objects).toHaveLength(1);
      expect(reportStorage.objects[0].bucket).toBe('REPORT-BUCKET');
      expect(parsePayload(reportStorage.objects[0].body)).toEqual([
        {
          amount: 1000,
          category: 'Sales',
          date: '08/04/2021',
          description: 'For work',
          name: 'Client',
          vat: 166.67,
        },
        {
          amount: 41.11,
          category: 'Bills',
          date: '09/04/2021',
          description: 'Mobile',
          name: 'EE',
          vat: 6.85,
        },
        {
          amount: 2.4,
          category: 'Bills',
          date: '10/04/2021',
          description: 'Domain',
          name: 'GoDaddy',
          vat: 0.4,
        },
      ]);
    });

    it('should wait for the uploader to resume after backpressure before querying the next page', async () => {
      const lastEvaluatedKey = {
        __typename: 'Transaction',
        data: 'OWNER-ID:COMPANY-ID:confirmed:next',
        id: 'last-id',
      };
      const firstPageItems = Array.from({ length: 40 }, (_, index) => ({
        amount: index,
        category: 'Bills',
        date: '09/04/2021',
        description: 'x'.repeat(1024),
        name: `Item ${index}`,
        vat: 0,
      }));
      const lastPageItems = [
        {
          amount: 99,
          category: 'Sales',
          date: '10/04/2021',
          description: 'last page',
          name: 'Client',
          vat: 0,
        },
      ];
      ddb
        .on(QueryCommand)
        .resolvesOnce({
          Items: firstPageItems,
          LastEvaluatedKey: lastEvaluatedKey,
        })
        .resolves({ Items: lastPageItems });

      let signalConsumerStarted: (() => void) | undefined;
      const consumerStarted = new Promise<void>((resolve) => {
        signalConsumerStarted = resolve;
      });
      const chunks: string[] = [];
      let resumeConsumer: (() => void) | undefined;
      let uploadedBody: Readable | undefined;
      reportStorage.uploader.mockImplementation(
        (bucket: string, key: string, body: Readable) => {
          uploadedBody = body;

          return {
            done: () =>
              new Promise<void>((resolve, reject) => {
                let isPaused = false;

                body.on('data', (chunk: Buffer) => {
                  chunks.push(chunk.toString());

                  if (!isPaused) {
                    isPaused = true;
                    body.pause();
                    signalConsumerStarted?.();
                  }
                });
                body.once('error', reject);
                body.once('end', () => {
                  reportStorage.objects.push({
                    body: chunks.join(''),
                    bucket,
                    key,
                  });
                  resolve();
                });
                resumeConsumer = () => body.resume();
              }),
          };
        },
      );

      const handlerResult = Promise.resolve(
        handler(event, context, callback),
      ).then((handlerOutput) => {
        if (!handlerOutput) {
          throw new Error('Expected a report result');
        }

        return handlerOutput;
      });

      try {
        await consumerStarted;

        if (!uploadedBody) {
          throw new Error('Expected the report stream to be uploaded');
        }

        await new Promise<void>((resolve) => {
          setTimeout(resolve, 0);
        });
        expect(uploadedBody.readableLength).toBeGreaterThanOrEqual(
          uploadedBody.readableHighWaterMark,
        );
        expect(chunks).toHaveLength(1);
        expect(ddb).toReceiveCommandTimes(QueryCommand, 1);
      } catch (error) {
        resumeConsumer?.();
        await handlerResult.catch(() => undefined);
        throw error;
      }

      resumeConsumer?.();
      const result = await handlerResult;

      expect(result.complete).toBe(false);
      expect(ddb).toReceiveCommandTimes(QueryCommand, 2);
      expect(parsePayload(reportStorage.objects[0].body)).toEqual([
        ...firstPageItems,
        ...lastPageItems,
      ]);
    });

    it('should return the original uploader error when it fails while the source is backpressured', async () => {
      const lastEvaluatedKey = {
        __typename: 'Transaction',
        data: 'OWNER-ID:COMPANY-ID:confirmed:next',
        id: 'last-id',
      };
      const uploadError = new Error('upload failed');
      ddb.on(QueryCommand).resolves({
        Items: Array.from({ length: 40 }, (_, index) => ({
          amount: index,
          category: 'Bills',
          date: '09/04/2021',
          description: 'x'.repeat(1024),
          name: `Item ${index}`,
          vat: 0,
        })),
        LastEvaluatedKey: lastEvaluatedKey,
      });
      reportStorage.uploader.mockImplementation(
        (_bucket: string, _key: string, body: Readable) => ({
          done: async () => {
            await new Promise<void>((resolve) => {
              body.once('data', () => {
                body.pause();
                resolve();
              });
            });
            await new Promise<void>((resolve) => {
              setTimeout(resolve, 0);
            });
            expect(body.readableLength).toBeGreaterThanOrEqual(
              body.readableHighWaterMark,
            );

            throw uploadError;
          },
        }),
      );

      await expect(handler(event, context, callback)).rejects.toBe(uploadError);

      expect(ddb).toReceiveCommandTimes(QueryCommand, 1);
      expect(reportStorage.objects).toHaveLength(0);
    });

    it('should store a result larger than the Step Functions payload limit outside workflow state', async () => {
      const description = 'a'.repeat(270 * 1024);
      ddb.on(QueryCommand).resolves({
        Items: [
          {
            amount: 1000,
            category: 'Sales',
            date: '08/04/2021',
            description,
            name: 'Client',
            vat: 166.67,
          },
        ],
      });

      const result = await handler(event, context, callback);

      if (!result) {
        throw new Error('Expected a report result');
      }

      expect(result).toMatchObject({
        companyId: 'COMPANY-ID',
        complete: false,
        currency: '£',
        owner: 'OWNER-ID',
      });
      expect(result.complete).toBe(false);
      if (result.complete) {
        throw new Error('Expected a report payload reference');
      }
      expect(result.payloadKey).toBeTypeOf('string');
      expect(Buffer.byteLength(reportStorage.objects[0].body)).toBeGreaterThan(
        256 * 1024,
      );
      expect(reportStorage.objects[0].body).toContain(
        `"description":"${description}"`,
      );
    });

    it('should return the correct data when no items are returned', async () => {
      ddb.on(QueryCommand).resolvesOnce({
        Items: [],
        LastEvaluatedKey: {},
      });

      await expect(handler(event, context, callback)).resolves.toEqual({
        complete: true,
      });

      expect(ddb).toReceiveCommandTimes(QueryCommand, 1);
      expect(reportStorage.objects).toHaveLength(0);
    });

    it('should continue across an empty page with a continuation key', async () => {
      const lastEvaluatedKey = {
        __typename: 'Transaction',
        data: 'OWNER-ID:COMPANY-ID:confirmed:next',
        id: 'last-id',
      };
      ddb
        .on(QueryCommand)
        .resolvesOnce({
          Items: [],
          LastEvaluatedKey: lastEvaluatedKey,
        })
        .resolves({
          Items: [
            {
              amount: 1000,
              category: 'Sales',
              date: '08/04/2021',
              description: 'For work',
              name: 'Client',
              vat: 166.67,
            },
          ],
        });

      const result = await handler(event, context, callback);

      if (!result) {
        throw new Error('Expected a report result');
      }

      expect(result.complete).toBe(false);
      if (result.complete) {
        throw new Error('Expected a report payload reference');
      }
      expect(result.payloadKey).toBeTypeOf('string');

      expect(ddb).toReceiveCommandTimes(QueryCommand, 2);
      expect(parsePayload(reportStorage.objects[0].body)).toHaveLength(1);
    });

    it('should surface a failure on a later query page', async () => {
      const queryError = new Error('last page failed');
      ddb
        .on(QueryCommand)
        .resolvesOnce({
          Items: [],
          LastEvaluatedKey: {
            __typename: 'Transaction',
            data: 'OWNER-ID:COMPANY-ID:confirmed:next',
            id: 'last-id',
          },
        })
        .rejects(queryError);

      await expect(handler(event, context, callback)).rejects.toBe(queryError);

      expect(reportStorage.objects).toHaveLength(0);
    });
  });
});
