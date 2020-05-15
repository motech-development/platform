import { S3 } from 'aws-sdk';
import { createWriteStream, exists, mkdir } from 'fs';
import { basename, join } from 'path';
import { promisify } from 'util';

const existsAsync = promisify(exists);
const mkdirAsync = promisify(mkdir);

export const createDirectory = async (name: string) => {
  const directoryExists = await existsAsync(name);

  if (!directoryExists) {
    await mkdirAsync(name);
  }
};

export const downloadFile = async (
  s3: S3,
  bucket: string,
  key: string,
  to: string,
) => {
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

export const deleteFile = async (s3: S3, bucket: string, key: string) => {
  const decodedKey = decodeURIComponent(key);

  await s3
    .deleteObject({
      Bucket: bucket,
      Key: decodedKey,
    })
    .promise();
};

export const moveFile = async (
  s3: S3,
  from: string,
  to: string,
  key: string,
) => {
  const decodedKey = decodeURIComponent(key);

  await s3
    .copyObject({
      Bucket: to,
      CopySource: join(from, decodedKey),
      Key: decodedKey,
    })
    .promise();

  await deleteFile(s3, from, key);
};
