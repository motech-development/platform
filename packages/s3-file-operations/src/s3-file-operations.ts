import {
  CopyObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  HeadObjectCommandOutput,
  ListObjectsV2Command,
  PutObjectCommand,
  PutObjectRequest,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createWriteStream, existsSync, ReadStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { Readable } from 'node:stream';

const s3 = new S3Client({});

export const createDirectory = async (name: string): Promise<boolean> => {
  const directoryExists = existsSync(name);

  if (!directoryExists) {
    await mkdir(name);
  }

  return directoryExists;
};

export const createFile = async (
  to: string,
  key: string,
  body: string | ReadStream,
  client = s3,
): Promise<void> => {
  const command = new PutObjectCommand({
    Body: body,
    Bucket: to,
    Key: key,
  });

  await client.send(command);
};

interface ICreateSignedUrlOpts {
  ContentType?: string;
  Metadata?: Record<string, string>;
}

type TOperation = 'getObject' | 'putObject';

export const createSignedUrl = async (
  operation: TOperation,
  bucket: string,
  key: string,
  expires: number,
  opts?: ICreateSignedUrlOpts,
  client = s3,
): Promise<string> => {
  const command =
    operation === 'getObject'
      ? new GetObjectCommand({
          Bucket: bucket,
          Key: key,
        })
      : new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          ...opts,
        });

  return getSignedUrl(client, command, {
    expiresIn: expires,
  });
};

export const deleteFile = async (
  bucket: string,
  key: string,
  client = s3,
): Promise<void> => {
  const decodedKey = decodeURIComponent(key);

  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: decodedKey,
  });

  await client.send(command);
};

export const downloadFileStream = async (
  bucket: string,
  key: string,
  client = s3,
): Promise<Readable> => {
  const decodedKey = decodeURIComponent(key);

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: decodedKey,
  });

  const response = await client.send(command);

  if (response?.Body instanceof Readable) {
    return response.Body;
  }

  throw new Error('Unable to stream file');
};

export const downloadFile = async (
  bucket: string,
  key: string,
  to: string,
  client = s3,
): Promise<string> => {
  const filePath = join(to, basename(key));
  const fileStream = createWriteStream(filePath);

  const stream = await downloadFileStream(bucket, key, client);

  return new Promise<string>((resolve, reject) => {
    stream
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
  client = s3,
): Promise<HeadObjectCommandOutput> => {
  const decodedKey = decodeURIComponent(key);

  const command = new HeadObjectCommand({
    Bucket: bucket,
    Key: decodedKey,
  });

  return client.send(command);
};

export const moveFile = async (
  from: string,
  to: string,
  key: string,
  client = s3,
): Promise<void> => {
  const decodedKey = decodeURIComponent(key);

  const command = new CopyObjectCommand({
    Bucket: to,
    CopySource: join(from, decodedKey),
    Key: decodedKey,
  });

  await client.send(command);

  await deleteFile(from, key);
};

export const removeFolder = async (
  bucket: string,
  key: string,
  client = s3,
): Promise<void> => {
  const decodedKey = decodeURIComponent(key);

  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: decodedKey,
  });

  const listedObjects = await client.send(command);

  if (listedObjects.Contents && listedObjects.Contents.length > 0) {
    const Objects = listedObjects.Contents.filter((item) => !!item.Key).map(
      ({ Key }) => ({
        Key,
      }),
    );

    const deleteObjectsCommand = new DeleteObjectsCommand({
      Bucket: bucket,
      Delete: {
        Objects,
      },
    });

    await client.send(deleteObjectsCommand);

    if (listedObjects.IsTruncated) {
      await removeFolder(bucket, key);
    }
  }
};

export const uploader = (
  bucket: string,
  key: string,
  body: PutObjectRequest['Body'],
  contentType: string,
  client = s3,
): Upload =>
  new Upload({
    client,
    params: {
      Body: body,
      Bucket: bucket,
      ContentType: contentType,
      Key: key,
    },
  });
