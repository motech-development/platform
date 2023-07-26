import logger from '@motech-development/node-logger';
import {
  downloadFileStream,
  uploader,
} from '@motech-development/s3-file-operations';
import Archiver from 'archiver';
import { PassThrough, Readable } from 'node:stream';

interface IArchiveDestination {
  bucket: string;
  key: string;
}

interface IArchiveOrigin {
  bucket: string;
  keys?: {
    key: string;
    path: string;
  }[];
}

interface IDownloadStream {
  buffer: Buffer;
  name: string;
}

const archive = async (
  report: string,
  destination: IArchiveDestination,
  origin: IArchiveOrigin,
) => {
  const archiver = Archiver('zip');
  const passThrough = new PassThrough();
  const upload = uploader(
    destination.bucket,
    destination.key,
    passThrough,
    'application/zip',
  ).done();
  const reportBuffer = Buffer.from(report);

  // Patch archiver to work on Node 18+
  const append = archiver.append.bind(archiver);

  archiver.append = function override(data, options) {
    const readable = new Readable();

    readable.push(
      process.env.NODE_ENV === 'test'
        ? (data as Buffer).toString('utf8')
        : data,
    );

    readable.push(null);

    append(readable, options);

    return this;
  };

  archiver.pipe(passThrough);

  archiver.append(reportBuffer, {
    name: 'report/accounts.csv',
  });

  if (origin.keys && origin.keys.length > 0) {
    logger.debug('Files', {
      total: origin.keys.length,
    });

    const downloadStreams = await Promise.all(
      origin.keys.map(async ({ key, path }, index) => {
        logger.info('Start downloading file', {
          index,
          key,
        });

        const stream = await downloadFileStream(origin.bucket, key);

        return new Promise<IDownloadStream>((resolve, reject) => {
          const chunks: Uint8Array[] = [];

          stream.on('data', (chunk: Uint8Array) => {
            logger.debug('Writing file chunk', {
              index,
              key,
            });

            chunks.push(chunk);
          });

          stream.on('end', () => {
            logger.info('File download complete', {
              index,
              key,
            });

            resolve({
              buffer: Buffer.concat(chunks),
              name: path,
            });
          });

          stream.on('error', (e) => {
            reject(e);
          });
        });
      }),
    );

    downloadStreams.forEach(({ buffer, name }, index) => {
      logger.debug('Adding file', {
        index,
        name,
      });

      archiver.append(buffer, {
        name,
      });
    });
  }

  logger.info('Archiver finalising');

  await archiver.finalize();

  logger.info('Uploading zip...');

  await upload;

  logger.info('Upload complete');
};

export default archive;
