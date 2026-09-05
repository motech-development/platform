import { randomUUID } from 'node:crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  S3Client,
  UploadPartCommand,
  UploadPartCopyCommand,
} from '@aws-sdk/client-s3';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const s3 = new S3Client({});

export interface StagedFile {
  empty?: boolean;
  expiresAt?: number;
  from: string;
  key: string;
  path: string;
  sourceETag?: string;
  state: 'pending' | 'ready' | 'deleting';
  to: string;
  token?: string;
  uploadId?: string;
}

const table = (): string => {
  if (!process.env.ATTACHMENT_TABLE) throw new Error('No attachment table set');
  return process.env.ATTACHMENT_TABLE;
};

const identity = (to: string, key: string) => ({
  path: `${to}/${key}`,
});
const namedError = (error: unknown, name: string) =>
  error instanceof Error && error.name === name;
export const isMissingFile = (error: unknown): boolean =>
  namedError(error, 'NotFound') || namedError(error, 'NoSuchKey');

export const allocateStagedFile = async (
  from: string,
  to: string,
  key: string,
  uploadExpiresInSeconds: number,
  quarantineRetentionDays: number,
): Promise<void> => {
  // Match S3's existing quarantine expiry: last possible upload + retention,
  // rounded up to the next UTC midnight. Ready attachments have no expiry.
  const expiry = new Date(Date.now() + uploadExpiresInSeconds * 1000);
  expiry.setUTCDate(expiry.getUTCDate() + quarantineRetentionDays + 1);
  expiry.setUTCHours(0, 0, 0, 0);
  const file: StagedFile = {
    ...identity(to, key),
    expiresAt: expiry.getTime() / 1000,
    from,
    key,
    state: 'pending',
    to,
  };
  await db.send(
    new PutCommand({
      ConditionExpression: 'attribute_not_exists(#path)',
      ExpressionAttributeNames: { '#path': 'path' },
      Item: file,
      TableName: table(),
    }),
  );
};

export const getStagedFile = async (
  to: string,
  key: string,
): Promise<StagedFile | undefined> => {
  const result = await db.send(
    new GetCommand({
      ConsistentRead: true,
      Key: identity(to, key),
      TableName: table(),
    }),
  );
  return result.Item as StagedFile | undefined;
};

const abortTransfer = async (
  file: Pick<StagedFile, 'to' | 'key' | 'uploadId'>,
): Promise<void> => {
  if (!file.uploadId) return;
  try {
    await s3.send(
      new AbortMultipartUploadCommand({
        Bucket: file.to,
        Key: file.key,
        UploadId: file.uploadId,
      }),
    );
  } catch (error) {
    if (!namedError(error, 'NoSuchUpload')) throw error;
  }
};

const removeObject = async (bucket: string, key: string): Promise<void> => {
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
};

const cleanupStagedFile = async (
  file: Pick<StagedFile, 'from' | 'to' | 'key' | 'uploadId'>,
): Promise<void> => {
  // Revoking this upload ID fences even a worker which already passed its DB
  // check. If completion won, NoSuchUpload is followed by deleting its object.
  await abortTransfer(file);
  await removeObject(file.to, file.key);
  await removeObject(file.from, file.key);
};

interface DeleteOptions {
  expiredBefore?: number;
  pendingOnly?: boolean;
}

export const deleteStagedFile = async (
  from: string,
  to: string,
  key: string,
  options: DeleteOptions = {},
): Promise<void> => {
  const { expiredBefore, pendingOnly } = options;
  let condition = 'attribute_exists(#path)';
  if (pendingOnly) {
    condition = '( #state = :pending OR #state = :deleting )';
    if (expiredBefore !== undefined)
      condition += ' AND expiresAt <= :expiredBefore';
  }
  let file: StagedFile | undefined;
  try {
    const result = await db.send(
      new UpdateCommand({
        ConditionExpression: condition,
        ExpressionAttributeNames: {
          ...(pendingOnly ? {} : { '#path': 'path' }),
          '#state': 'state',
        },
        ExpressionAttributeValues: {
          ':cleanupAt': Math.floor(Date.now() / 1000),
          ':deleting': 'deleting',
          ...(pendingOnly ? { ':pending': 'pending' } : {}),
          ...(expiredBefore === undefined
            ? {}
            : { ':expiredBefore': expiredBefore }),
        },
        Key: identity(to, key),
        ReturnValues: 'ALL_NEW',
        TableName: table(),
        // Keep failed deletions discoverable after ready records lost their expiry.
        UpdateExpression: 'SET #state = :deleting, expiresAt = :cleanupAt',
      }),
    );
    file = result.Attributes as StagedFile;
  } catch (error) {
    if (!namedError(error, 'ConditionalCheckFailedException')) throw error;
    if (pendingOnly) {
      if (expiredBefore === undefined) await removeObject(from, key);
      return;
    }
  }
  await cleanupStagedFile(file ?? { from, key, to });
  if (file)
    await db.send(
      new DeleteCommand({ Key: identity(to, key), TableName: table() }),
    );
};

const copied = async (file: StagedFile): Promise<boolean> => {
  if (!file.token) return false;
  try {
    const result = await s3.send(
      new HeadObjectCommand({ Bucket: file.to, Key: file.key }),
    );
    return result.Metadata?.['attachment-transfer'] === file.token;
  } catch (error) {
    if (isMissingFile(error)) return false;
    throw error;
  }
};

const registerTransfer = async (
  file: StagedFile,
): Promise<StagedFile | undefined> => {
  const source = await s3.send(
    new HeadObjectCommand({ Bucket: file.from, Key: file.key }),
  );
  if (!source.ETag) throw new Error('Source has no ETag');
  const token = randomUUID();
  const result = await s3.send(
    new CreateMultipartUploadCommand({
      Bucket: file.to,
      CacheControl: source.CacheControl,
      ContentDisposition: source.ContentDisposition,
      ContentEncoding: source.ContentEncoding,
      ContentLanguage: source.ContentLanguage,
      ContentType: source.ContentType,
      Expires: source.ExpiresString
        ? new Date(source.ExpiresString)
        : undefined,
      Key: file.key,
      Metadata: { ...source.Metadata, 'attachment-transfer': token },
    }),
  );
  if (!result.UploadId) throw new Error('S3 returned no upload ID');
  const transfer = {
    ...file,
    empty: source.ContentLength === 0,
    sourceETag: source.ETag,
    token,
    uploadId: result.UploadId,
  };
  try {
    await db.send(
      new UpdateCommand({
        ConditionExpression:
          '#state = :pending AND attribute_not_exists(uploadId)',
        ExpressionAttributeNames: {
          '#empty': 'empty',
          '#state': 'state',
          '#token': 'token',
        },
        ExpressionAttributeValues: {
          ':empty': transfer.empty,
          ':pending': 'pending',
          ':sourceETag': transfer.sourceETag,
          ':token': token,
          ':uploadId': transfer.uploadId,
        },
        Key: identity(file.to, file.key),
        TableName: table(),
        UpdateExpression:
          'SET uploadId = :uploadId, #token = :token, sourceETag = :sourceETag, #empty = :empty',
      }),
    );
    return transfer;
  } catch (error) {
    // A lost response may hide a successful registration. Resolve it before
    // aborting, since another invocation could already be using that ID.
    // An uncertain write can still commit later; only a definitive condition
    // failure permits abort here. S3 lifecycle clears unregistered uploads.
    const current = await getStagedFile(file.to, file.key);
    if (current?.uploadId === transfer.uploadId) return current;
    if (!namedError(error, 'ConditionalCheckFailedException')) throw error;
    await abortTransfer(transfer);
    return current;
  }
};

const finishTransfer = async (file: StagedFile): Promise<void> => {
  if (!file.uploadId || !file.sourceETag)
    throw new Error('Incomplete transfer registration');
  const target = {
    Bucket: file.to,
    Key: file.key,
    PartNumber: 1,
    UploadId: file.uploadId,
  };
  const etag = file.empty
    ? (
        await s3.send(
          new UploadPartCommand({ ...target, Body: new Uint8Array() }),
        )
      ).ETag
    : (
        await s3.send(
          new UploadPartCopyCommand({
            ...target,
            CopySource: `${file.from}/${encodeURIComponent(file.key)}`,
            CopySourceIfMatch: file.sourceETag,
          }),
        )
      ).CopyPartResult?.ETag;
  if (!etag) throw new Error('S3 returned no part ETag');
  await s3.send(
    new CompleteMultipartUploadCommand({
      Bucket: file.to,
      Key: file.key,
      MultipartUpload: { Parts: [{ ETag: etag, PartNumber: 1 }] },
      UploadId: file.uploadId,
    }),
  );
};

const completeRegisteredTransfer = async (file: StagedFile): Promise<void> => {
  if (!(await copied(file))) {
    try {
      await finishTransfer(file);
    } catch (error) {
      if (!(await copied(file))) throw error;
    }
  }
  await db.send(
    new UpdateCommand({
      ConditionExpression: '#state = :pending AND uploadId = :uploadId',
      ExpressionAttributeNames: { '#state': 'state' },
      ExpressionAttributeValues: {
        ':pending': 'pending',
        ':ready': 'ready',
        ':uploadId': file.uploadId,
      },
      Key: identity(file.to, file.key),
      TableName: table(),
      UpdateExpression: 'SET #state = :ready REMOVE expiresAt',
    }),
  );
};

export const moveStagedFile = async (
  from: string,
  to: string,
  key: string,
): Promise<void> => {
  let file = await getStagedFile(to, key);
  try {
    if (file?.state === 'pending' && !file.uploadId)
      file = await registerTransfer(file);
    if (!file || file.state === 'deleting') {
      await deleteStagedFile(from, to, key);
      return;
    }
    if (file.state === 'pending') await completeRegisteredTransfer(file);
    await removeObject(from, key);
  } catch (error) {
    const current = await getStagedFile(to, key);
    if (!current || current.state === 'deleting') {
      await deleteStagedFile(from, to, key);
      return;
    }
    if (current.state === 'ready' && current.uploadId === file?.uploadId) {
      await removeObject(from, key);
      return;
    }
    throw error;
  }
};

export const cleanupExpiredStagedFiles = async (): Promise<void> => {
  const expiredBefore = Math.floor(Date.now() / 1000);
  const cleanPage = async (
    state: string,
    cursor?: Record<string, unknown>,
  ): Promise<void> => {
    const result = await db.send(
      new QueryCommand({
        ExclusiveStartKey: cursor,
        ExpressionAttributeNames: { '#state': 'state' },
        ExpressionAttributeValues: {
          ':expiredBefore': expiredBefore,
          ':state': state,
        },
        IndexName: 'PendingExpiry',
        KeyConditionExpression:
          '#state = :state AND expiresAt <= :expiredBefore',
        TableName: table(),
      }),
    );
    await Promise.all(
      (result.Items ?? []).map(async (item) => {
        const file = item as StagedFile;
        if (file.state === 'pending' && (await copied(file))) {
          await moveStagedFile(file.from, file.to, file.key);
          return;
        }
        await deleteStagedFile(file.from, file.to, file.key, {
          expiredBefore,
          pendingOnly: true,
        });
      }),
    );
    if (result.LastEvaluatedKey)
      await cleanPage(state, result.LastEvaluatedKey);
  };
  await Promise.all(['pending', 'deleting'].map((state) => cleanPage(state)));
};
