import { S3 } from 'aws-sdk';
import { createWriteStream, existsSync, mkdir, ReadStream } from 'fs';
import { basename, join } from 'path';
import { promisify } from 'util';

const mkdirAsync = promisify(mkdir);
const s3 = new S3();

export const createDirectory = async (name: string) => {
  const directoryExists = existsSync(name);

  if (!directoryExists) {
    await mkdirAsync(name);
  }

  return directoryExists;
};

export const createFile = async (
  to: string,
  key: string,
  body: string | ReadStream,
) => {
  await s3
    .putObject({
      Body: body,
      Bucket: to,
      Key: key,
    })
    .promise();
};

interface ICreateSignedUrlOpts {
  ContentType?: string;
  Metadata?: S3.Metadata;
}

export const createSignedUrl = async (
  operation: string,
  bucket: string,
  key: string,
  expires: number,
  opts?: ICreateSignedUrlOpts,
) =>
  s3.getSignedUrlPromise(operation, {
    Bucket: bucket,
    Expires: expires,
    Key: key,
    ...opts,
  });

export const deleteFile = async (bucket: string, key: string) => {
  const decodedKey = decodeURIComponent(key);

  await s3
    .deleteObject({
      Bucket: bucket,
      Key: decodedKey,
    })
    .promise();
};

export const downloadFileStream = (bucket: string, key: string) => {
  const decodedKey = decodeURIComponent(key);

  return s3
    .getObject({
      Bucket: bucket,
      Key: decodedKey,
    })
    .createReadStream();
};

export const downloadFile = async (bucket: string, key: string, to: string) => {
  const filePath = join(to, basename(key));
  const fileStream = createWriteStream(filePath);

  return new Promise<string>((resolve, reject) => {
    downloadFileStream(bucket, key)
      .on('end', () => {
        resolve(filePath);
      })
      .on('error', reject)
      .pipe(fileStream);
  });
};

export const getFileData = async (bucket: string, key: string) => {
  const decodedKey = decodeURIComponent(key);

  return s3
    .headObject({
      Bucket: bucket,
      Key: decodedKey,
    })
    .promise();
};

export const moveFile = async (from: string, to: string, key: string) => {
  const decodedKey = decodeURIComponent(key);

  await s3
    .copyObject({
      Bucket: to,
      CopySource: join(from, decodedKey),
      Key: decodedKey,
    })
    .promise();

  await deleteFile(from, key);
};

export const uploader = (
  bucket: string,
  key: string,
  body: S3.Body,
  contentType: string,
) =>
  s3.upload({
    Body: body,
    Bucket: bucket,
    ContentType: contentType,
    Key: key,
  });
