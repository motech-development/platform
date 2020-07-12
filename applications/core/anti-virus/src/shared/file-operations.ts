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

export const deleteFile = async (bucket: string, key: string) => {
  const decodedKey = decodeURIComponent(key);

  await s3
    .deleteObject({
      Bucket: bucket,
      Key: decodedKey,
    })
    .promise();
};

export const downloadFile = async (bucket: string, key: string, to: string) => {
  const decodedKey = decodeURIComponent(key);
  const filePath = join(to, basename(key));
  const fileStream = createWriteStream(filePath);

  return new Promise<string>((resolve, reject) => {
    s3.getObject({
      Bucket: bucket,
      Key: decodedKey,
    })
      .createReadStream()
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
