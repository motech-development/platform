import { AWSError, S3 } from 'aws-sdk';
import { ObjectIdentifier } from 'aws-sdk/clients/s3';
import { PromiseResult } from 'aws-sdk/lib/request';
import { createWriteStream, existsSync, mkdir, ReadStream } from 'fs';
import { basename, join } from 'path';
import { Readable } from 'stream';
import { promisify } from 'util';

const mkdirAsync = promisify(mkdir);
const s3 = new S3();

export const createDirectory = async (name: string): Promise<boolean> => {
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
): Promise<void> => {
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
): Promise<string> =>
  s3.getSignedUrlPromise(operation, {
    Bucket: bucket,
    Expires: expires,
    Key: key,
    ...opts,
  });

export const deleteFile = async (
  bucket: string,
  key: string,
): Promise<void> => {
  const decodedKey = decodeURIComponent(key);

  await s3
    .deleteObject({
      Bucket: bucket,
      Key: decodedKey,
    })
    .promise();
};

export const downloadFileStream = (bucket: string, key: string): Readable => {
  const decodedKey = decodeURIComponent(key);

  return s3
    .getObject({
      Bucket: bucket,
      Key: decodedKey,
    })
    .createReadStream();
};

export const downloadFile = async (
  bucket: string,
  key: string,
  to: string,
): Promise<string> => {
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

export const getFileData = async (
  bucket: string,
  key: string,
): Promise<PromiseResult<S3.HeadObjectOutput, AWSError>> => {
  const decodedKey = decodeURIComponent(key);

  return s3
    .headObject({
      Bucket: bucket,
      Key: decodedKey,
    })
    .promise();
};

export const moveFile = async (
  from: string,
  to: string,
  key: string,
): Promise<void> => {
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

export const removeFolder = async (
  bucket: string,
  key: string,
): Promise<void> => {
  const decodedKey = decodeURIComponent(key);

  const listedObjects = await s3
    .listObjectsV2({
      Bucket: bucket,
      Prefix: decodedKey,
    })
    .promise();

  if (listedObjects.Contents && listedObjects.Contents.length > 0) {
    const Objects = listedObjects.Contents.filter(
      (item): item is ObjectIdentifier => !!item.Key,
    ).map(({ Key }) => ({
      Key,
    }));

    await s3
      .deleteObjects({
        Bucket: bucket,
        Delete: {
          Objects,
        },
      })
      .promise();

    if (listedObjects.IsTruncated) {
      await removeFolder(bucket, key);
    }
  }
};

export const uploader = (
  bucket: string,
  key: string,
  body: S3.Body,
  contentType: string,
): S3.ManagedUpload =>
  s3.upload({
    Body: body,
    Bucket: bucket,
    ContentType: contentType,
    Key: key,
  });
