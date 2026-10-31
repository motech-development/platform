import { Readable } from 'node:stream';
import type {
  QueryCommandInput,
  QueryCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import {
  downloadFileStream,
  uploader,
} from '@motech-development/s3-file-operations';
import type { InferType, ObjectSchema } from 'yup';
import { array, object, string } from 'yup';

export const reportPayloadEventSchema = object({
  companyId: string().required(),
  owner: string().required(),
  payloadKey: string().required(),
}).required();

export type IReportPayloadReference = InferType<
  typeof reportPayloadEventSchema
>;

const reportAttachmentSchema = object({
  key: string().required(),
  path: string().required(),
}).required();

export const reportPayloadMetadataSchema = object({
  attachments: array(reportAttachmentSchema),
  companyId: string().required(),
  owner: string().required(),
}).required();

export const readReportPayload = async (
  bucket: string,
  key: string,
): Promise<unknown> => {
  const stream = await downloadFileStream(bucket, key);
  const chunks: string[] = [];

  return new Promise((resolve, reject) => {
    stream.setEncoding('utf8');
    stream.on('data', (chunk: string) => chunks.push(chunk));
    stream.once('error', (error: Error) => reject(error));
    stream.once('end', () => {
      try {
        resolve(JSON.parse(chunks.join('')) as unknown);
      } catch (error) {
        reject(
          error instanceof Error
            ? error
            : new Error('Unable to parse report payload'),
        );
      }
    });
  });
};

export const readReportPayloadEvent = async <T extends IReportPayloadReference>(
  event: unknown,
  eventSchema: ObjectSchema<T>,
): Promise<{ bucket: string; input: T; payload: unknown }> => {
  const bucket = process.env.REPORT_BUCKET;

  if (!bucket) {
    throw new Error('No report bucket set');
  }

  const input = (await eventSchema.validate(event, {
    abortEarly: true,
    stripUnknown: true,
  })) as T;
  const payload = await readReportPayload(bucket, input.payloadKey);

  return {
    bucket,
    input,
    payload,
  };
};

export const writeReportPayloadStream = async (
  bucket: string,
  key: string,
  body: Readable,
): Promise<void> => {
  await uploader(bucket, key, body, 'application/json').done();
};

export type ReportQueryPageReader = (
  key?: QueryCommandInput['ExclusiveStartKey'],
  abortSignal?: AbortSignal,
) => Promise<QueryCommandOutput>;

export const hasQueryContinuationKey = (
  key?: QueryCommandInput['ExclusiveStartKey'],
): key is NonNullable<QueryCommandInput['ExclusiveStartKey']> =>
  !!key && Object.keys(key).length > 0;

class QueryPagesReadable extends Readable {
  private page: QueryCommandOutput;

  private itemIndex = 0;

  private isFirstTransaction = true;

  private isStarted = false;

  private isEnded = false;

  private isPumping = false;

  private transactionTotal = 0;

  private readonly abortController = new AbortController();

  private producerError?: Error;

  private uploadError?: Error;

  constructor(
    firstPage: QueryCommandOutput,
    private readonly queryPage: ReportQueryPageReader,
  ) {
    super({
      highWaterMark: 16 * 1024,
      objectMode: false,
      read: () => {
        this.pump().catch(() => undefined);
      },
    });

    this.page = firstPage;
  }

  get count(): number {
    return this.transactionTotal;
  }

  get sourceError(): Error | undefined {
    return this.producerError;
  }

  abort(error: Error): void {
    this.uploadError = error;
    this.abortController.abort(error);
    this.destroy();
  }

  private schedulePump(): void {
    setImmediate(() => {
      this.pump().catch(() => undefined);
    });
  }

  private emitNextTransaction(): 'blocked' | 'empty' | 'written' {
    const items = this.page.Items ?? [];

    if (this.itemIndex >= items.length) {
      return 'empty';
    }

    const item = items[this.itemIndex];

    if (!item) {
      throw new Error('A report query returned an invalid item');
    }

    const serializedItem = JSON.stringify(item);

    if (serializedItem === undefined) {
      throw new Error('Unable to serialize a report transaction');
    }

    this.itemIndex += 1;
    this.transactionTotal += 1;
    const chunk = `${this.isFirstTransaction ? '' : ','}${serializedItem}`;
    this.isFirstTransaction = false;

    return this.push(chunk) ? 'written' : 'blocked';
  }

  private async loadNextPage(): Promise<boolean> {
    if (!hasQueryContinuationKey(this.page.LastEvaluatedKey)) {
      return false;
    }

    this.page = await this.queryPage(
      this.page.LastEvaluatedKey,
      this.abortController.signal,
    );
    this.itemIndex = 0;

    return true;
  }

  private finish(): void {
    this.isEnded = true;
    this.push(']');
    // Readable.push(null) is the end-of-stream sentinel, not a payload chunk.
    this.push(null);
  }

  private async pump(): Promise<void> {
    if (this.isPumping || this.destroyed || this.isEnded) {
      return;
    }

    this.isPumping = true;

    try {
      if (!this.isStarted) {
        this.isStarted = true;

        if (!this.push('[')) {
          return;
        }
      }

      const transactionResult = this.emitNextTransaction();

      if (transactionResult === 'written') {
        this.schedulePump();
        return;
      }

      if (transactionResult === 'blocked') {
        return;
      }

      if (await this.loadNextPage()) {
        this.schedulePump();
        return;
      }

      this.finish();
    } catch (error) {
      if (this.uploadError !== undefined) {
        this.destroy();

        return;
      }

      this.producerError =
        error instanceof Error
          ? error
          : new Error('Failed to produce the report payload');
      this.destroy(this.producerError);
    } finally {
      this.isPumping = false;
    }
  }
}

export const writeReportQueryPages = async (
  bucket: string,
  key: string,
  firstPage: QueryCommandOutput,
  queryPage: ReportQueryPageReader,
): Promise<number> => {
  const payloadStream = new QueryPagesReadable(firstPage, queryPage);

  try {
    await writeReportPayloadStream(bucket, key, payloadStream);
  } catch (error) {
    const uploadError =
      error instanceof Error ? error : new Error('Failed to upload report');
    payloadStream.abort(uploadError);

    throw payloadStream.sourceError ?? uploadError;
  }

  return payloadStream.count;
};

export const writeReportPayload = async (
  bucket: string,
  key: string,
  payload: object,
): Promise<void> => {
  const serializedPayload = JSON.stringify(payload);

  if (serializedPayload === undefined) {
    throw new Error('Unable to serialize report payload');
  }

  await writeReportPayloadStream(
    bucket,
    key,
    Readable.from([serializedPayload]),
  );
};
