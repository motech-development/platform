import { createWriteStream, existsSync, ReadStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
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

export {
  allocateStagedFile,
  cleanupExpiredStagedFiles,
  deleteStagedFile,
  getStagedFile,
  isMissingFile,
  moveStagedFile,
} from './file-lifecycle';

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

type ICreateSignedUrlOpts = Pick<PutObjectRequest, 'ContentType' | 'Metadata'>;

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
  const stream = await downloadFileStream(bucket, key, client);

  try {
    await pipeline(stream, createWriteStream(filePath));
  } catch (error) {
    stream.destroy();

    throw error;
  }

  return filePath;
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

  await deleteFile(from, key, client);
};

const formatDeleteFailure = ({
  Code,
  Key,
  Message,
}: {
  Code?: string;
  Key?: string;
  Message?: string;
}): string => {
  const key = Key ?? 'unknown key';
  const code = Code ?? 'unknown error';
  const message = Message ? ` (${Message})` : '';

  return `${key}: ${code}${message}`;
};

export const removeFolder = async (
  bucket: string,
  key: string,
  client = s3,
): Promise<void> => {
  const decodedKey = decodeURIComponent(key);

  const removePage = async (continuationToken?: string): Promise<void> => {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: decodedKey,
      ...(continuationToken ? { ContinuationToken: continuationToken } : {}),
    });

    const listedObjects = await client.send(command);
    const objects = (listedObjects.Contents ?? [])
      .filter((item) => !!item.Key)
      .map(({ Key }) => ({ Key }));

    const batchCount = Math.ceil(objects.length / 1000);
    const deleteResults = await Promise.all(
      Array.from({ length: batchCount }, (_, index) => {
        const deleteObjectsCommand = new DeleteObjectsCommand({
          Bucket: bucket,
          Delete: {
            Objects: objects.slice(index * 1000, (index + 1) * 1000),
          },
        });

        return client.send(deleteObjectsCommand);
      }),
    );
    const errors = deleteResults.flatMap(({ Errors }) => Errors ?? []);

    if (errors.length) {
      const failures = errors.map(formatDeleteFailure);

      throw new Error(`Failed to delete S3 objects: ${failures.join('; ')}`);
    }

    if (!listedObjects.IsTruncated) {
      return;
    }

    if (!listedObjects.NextContinuationToken) {
      throw new Error(
        'S3 object listing was truncated without a continuation token',
      );
    }

    await removePage(listedObjects.NextContinuationToken);
  };

  await removePage();
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
