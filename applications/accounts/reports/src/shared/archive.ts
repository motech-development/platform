import logger from '@motech-development/node-logger';
import {
  downloadFileStream,
  uploader,
} from '@motech-development/s3-file-operations';
import Archiver from 'archiver';
import { PassThrough } from 'node:stream';

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
  );
  const reportBuffer = Buffer.from(report);

  archiver.pipe(passThrough);

  archiver.append(reportBuffer, {
    name: 'report/accounts.csv',
  });

  if (origin.keys && origin.keys.length > 0) {
    logger.debug('Files', {
      total: origin.keys.length,
    });

    const downloadStreams = await Promise.all(
      origin.keys.map(async ({ key, path }) => {
        logger.info('Start downloading file', {
          key,
        });

        const stream = await downloadFileStream(origin.bucket, key);

        stream.on('data', () => {});

        stream.on('end', () => {
          logger.info('File download complete', {
            key,
          });
        });

        return {
          name: path,
          stream,
        };
      }),
    );

    downloadStreams.forEach(({ name, stream }) => {
      logger.debug('Adding file', {
        name,
      });

      archiver.append(stream, {
        name,
      });
    });
  }

  logger.info('Archiver finalising');

  await archiver.finalize();

  logger.info('Uploading zip...');

  await upload.done();

  logger.info('Upload complete');
};

export default archive;
