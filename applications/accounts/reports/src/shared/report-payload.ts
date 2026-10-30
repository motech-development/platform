import { Readable } from 'node:stream';
import {
  downloadFileStream,
  uploader,
} from '@motech-development/s3-file-operations';

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

export const writeReportPayloadStream = async (
  bucket: string,
  key: string,
  body: Readable,
): Promise<void> => {
  await uploader(bucket, key, body, 'application/json').done();
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
