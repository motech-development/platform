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
    const downloadStreams = await Promise.all(
      origin.keys.map(async ({ key, path }) => ({
        name: path,
        stream: await downloadFileStream(origin.bucket, key),
      })),
    );

    downloadStreams.forEach(({ name, stream }) => {
      archiver.append(stream, {
        name,
      });
    });
  }

  await archiver.finalize();

  return upload.done();
};

export default archive;
