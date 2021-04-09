import { downloadFileStream } from '@motech-development/s3-file-operations';
import Archiver from 'archiver';
import { S3 } from 'aws-sdk';
import { Stream } from 'stream';

const archiver = Archiver('zip');
const s3 = new S3();
const streamPassThrough = new Stream.PassThrough();

interface IArchiveDestination {
  bucket: string;
  key: string;
}

interface IArchiveOrigin {
  bucket: string;
  keys: {
    key: string;
    path: string;
  }[];
}

const archive = async (
  report: string,
  destination: IArchiveDestination,
  origin: IArchiveOrigin,
) => {
  const upload = s3.upload({
    Body: streamPassThrough,
    Bucket: destination.bucket,
    ContentType: 'application/zip',
    Key: destination.key,
  });
  const reportBuffer = Buffer.from(report);
  const downloadStreams = origin.keys.map(({ key, path }) => ({
    name: path,
    stream: downloadFileStream(origin.bucket, key),
  }));

  await new Promise((resolve, reject) => {
    streamPassThrough.on('close', resolve);
    streamPassThrough.on('end', resolve);
    streamPassThrough.on('error', reject);

    archiver.pipe(streamPassThrough);

    downloadStreams.forEach(({ name, stream }) => {
      archiver.append(stream, {
        name,
      });
    });

    archiver.append(reportBuffer, {
      name: 'report.csv',
    });

    archiver.finalize();
  });

  await upload.promise();
};

export default archive;
