import {
  AbortMultipartUploadCommand,
  AbortMultipartUploadCommandInput,
  CompleteMultipartUploadCommand,
  CompleteMultipartUploadCommandInput,
  CreateMultipartUploadCommand,
  CreateMultipartUploadCommandInput,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  HeadObjectCommand,
  HeadObjectCommandInput,
  S3Client,
  UploadPartCommand,
  UploadPartCopyCommand,
  UploadPartCopyCommandInput,
} from '@aws-sdk/client-s3';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
  UpdateCommand,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import {
  allocateStagedFile,
  cleanupExpiredStagedFiles,
  deleteStagedFile,
  moveStagedFile,
  type StagedFile,
} from '../file-lifecycle';

const db = mockClient(DynamoDBDocumentClient);
const s3 = mockClient(S3Client);
const from = 'uploads';
const to = 'downloads';
const key = 'owner/company/file.pdf';
const fail = (name: string) => Object.assign(new Error(name), { name });

const pause = () => {
  let release = () => {};
  let entered = () => {};
  const reached = new Promise<void>((resolve) => {
    entered = resolve;
  });
  const resumed = new Promise<void>((resolve) => {
    release = resolve;
  });
  return {
    reached,
    release,
    wait: async () => {
      entered();
      await resumed;
    },
  };
};

describe('staged file lifecycle', () => {
  let file: StagedFile | undefined;
  let source: boolean;
  let destination: string | undefined;
  let uploads: Map<string, string>;
  let beforeRegister: () => Promise<void>;
  let beforeComplete: () => Promise<void>;
  let beforeReady: () => Promise<void>;
  let afterComplete: () => Promise<void>;

  beforeEach(() => {
    vi.stubEnv('ATTACHMENT_TABLE', 'attachments');
    db.reset();
    s3.reset();
    file = undefined;
    source = true;
    destination = undefined;
    uploads = new Map();
    beforeRegister = async () => {};
    beforeComplete = async () => {};
    afterComplete = async () => {};
    beforeReady = async () => {};
    db.on(PutCommand).callsFake((input: PutCommandInput) => {
      if (file) throw fail('ConditionalCheckFailedException');
      file = structuredClone(input.Item) as StagedFile;
      return {};
    });
    db.on(GetCommand).callsFake(() => ({
      Item: file && structuredClone(file),
    }));
    db.on(UpdateCommand).callsFake(async (input: UpdateCommandInput) => {
      const values = input.ExpressionAttributeValues as Record<string, unknown>;
      if (values[':uploadId'] && !values[':ready']) {
        await beforeRegister();
        if (!file || file.state !== 'pending' || file.uploadId)
          throw fail('ConditionalCheckFailedException');
        Object.assign(file, {
          empty: values[':empty'],
          sourceETag: values[':sourceETag'],
          token: values[':token'],
          uploadId: values[':uploadId'],
        });
      } else if (values[':ready']) {
        await beforeReady();
        if (
          !file ||
          file.state === 'deleting' ||
          file.uploadId !== values[':uploadId']
        )
          throw fail('ConditionalCheckFailedException');
        file.state = 'ready';
        delete file.expiresAt;
      } else {
        if (
          !file ||
          (values[':pending'] && file.state === 'ready') ||
          (typeof values[':expiredBefore'] === 'number' &&
            (file.expiresAt === undefined ||
              file.expiresAt > values[':expiredBefore']))
        )
          throw fail('ConditionalCheckFailedException');
        file.state = 'deleting';
      }
      return { Attributes: structuredClone(file) };
    });
    db.on(QueryCommand).callsFake((input: QueryCommandInput) => ({
      Items:
        file?.state === input.ExpressionAttributeValues?.[':state']
          ? [structuredClone(file)]
          : [],
    }));
    db.on(DeleteCommand).callsFake(() => {
      file = undefined;
      return {};
    });
    s3.on(HeadObjectCommand).callsFake((input: HeadObjectCommandInput) => {
      if (input.Bucket === from && source)
        return {
          ContentLength: 10,
          ContentType: 'application/pdf',
          ETag: 'source-etag',
          Metadata: { id: 'transaction', typename: 'Transaction' },
        };
      if (input.Bucket === to && destination)
        return { Metadata: { 'attachment-transfer': destination } };
      throw fail('NotFound');
    });
    let sequence = 0;
    s3.on(CreateMultipartUploadCommand).callsFake(
      (input: CreateMultipartUploadCommandInput) => {
        sequence += 1;
        const id = String(sequence);
        uploads.set(id, input.Metadata?.['attachment-transfer'] ?? '');
        return { UploadId: id };
      },
    );
    s3.on(UploadPartCopyCommand).callsFake(
      (input: UploadPartCopyCommandInput) => {
        if (!uploads.has(input.UploadId ?? '')) throw fail('NoSuchUpload');
        if (!source) throw fail('NoSuchKey');
        return { CopyPartResult: { ETag: 'part-etag' } };
      },
    );
    s3.on(CompleteMultipartUploadCommand).callsFake(
      async (input: CompleteMultipartUploadCommandInput) => {
        await beforeComplete();
        const token = uploads.get(input.UploadId ?? '');
        if (!token) throw fail('NoSuchUpload');
        destination = token;
        uploads.delete(input.UploadId ?? '');
        await afterComplete();
        return {};
      },
    );
    s3.on(AbortMultipartUploadCommand).callsFake(
      (input: AbortMultipartUploadCommandInput) => {
        if (!uploads.delete(input.UploadId ?? '')) throw fail('NoSuchUpload');
        return {};
      },
    );
    s3.on(DeleteObjectCommand).callsFake((input: DeleteObjectCommandInput) => {
      if (input.Bucket === from) source = false;
      else destination = undefined;
      return {};
    });
  });

  afterEach(() => vi.unstubAllEnvs());

  const allocate = () => allocateStagedFile(from, to, key, 30, 1);
  const snapshot = () => ({ destination, file, source, uploads: uploads.size });

  it('allocates only a database record, without a download object', async () => {
    await allocate();
    expect(file?.state).toBe('pending');
    expect(s3.calls()).toHaveLength(0);
  });

  it('promotes a wanted file and preserves its metadata and content type', async () => {
    await allocate();
    await moveStagedFile(from, to, key);
    expect(destination).toBeDefined();
    expect(source).toBe(false);
    expect(file?.state).toBe('ready');
    expect(file?.expiresAt).toBeUndefined();
    expect(s3).toHaveReceivedCommandWith(CreateMultipartUploadCommand, {
      ContentType: 'application/pdf',
      Metadata: {
        'attachment-transfer': destination ?? '',
        id: 'transaction',
        typename: 'Transaction',
      },
    });
  });

  it('does not promote after deletion, including a late upload and duplicate scan', async () => {
    await allocate();
    await deleteStagedFile(from, to, key);
    source = true;
    await moveStagedFile(from, to, key);
    await moveStagedFile(from, to, key);
    expect(snapshot()).toEqual({
      destination: undefined,
      file: undefined,
      source: false,
      uploads: 0,
    });
  });

  it('cancels a transfer paused before it can register with the database', async () => {
    await allocate();
    const gate = pause();
    beforeRegister = gate.wait;
    const moving = moveStagedFile(from, to, key);
    await gate.reached;
    await deleteStagedFile(from, to, key);
    gate.release();
    await moving;
    expect(snapshot()).toEqual({
      destination: undefined,
      file: undefined,
      source: false,
      uploads: 0,
    });
  });

  it('prevents an already-started completion from recreating a deleted file', async () => {
    await allocate();
    const gate = pause();
    const acknowledgement = pause();
    beforeComplete = gate.wait;
    afterComplete = acknowledgement.wait;
    const moving = moveStagedFile(from, to, key);
    await gate.reached;
    await deleteStagedFile(from, to, key);
    expect(destination).toBeUndefined();
    gate.release();
    try {
      // Observe the destination even if the worker stalls after S3 responds,
      // before any compensating cleanup in that worker can run.
      await Promise.race([acknowledgement.reached, moving]);
      expect(destination).toBeUndefined();
    } finally {
      acknowledgement.release();
      await moving;
    }
    expect(snapshot()).toEqual({
      destination: undefined,
      file: undefined,
      source: false,
      uploads: 0,
    });
  });

  it('deletes a copy that completed before the worker acknowledged it', async () => {
    await allocate();
    const gate = pause();
    afterComplete = gate.wait;
    const moving = moveStagedFile(from, to, key);
    await gate.reached;
    await deleteStagedFile(from, to, key);
    gate.release();
    await moving;
    expect(snapshot()).toEqual({
      destination: undefined,
      file: undefined,
      source: false,
      uploads: 0,
    });
  });

  it('recovers a completed transfer when its response was lost', async () => {
    await allocate();
    afterComplete = () => Promise.reject(new Error('connection lost'));
    await moveStagedFile(from, to, key);
    await moveStagedFile(from, to, key);
    expect(file?.state).toBe('ready');
    expect(destination).toBeDefined();
    expect(s3).toHaveReceivedCommandTimes(CreateMultipartUploadCommand, 1);
  });

  it('keeps deletion retryable if cancelling the transfer fails', async () => {
    await allocate();
    beforeComplete = () => Promise.reject(new Error('worker interrupted'));
    await expect(moveStagedFile(from, to, key)).rejects.toThrow(
      'worker interrupted',
    );
    s3.on(AbortMultipartUploadCommand).rejectsOnce(new Error('S3 unavailable'));
    await expect(deleteStagedFile(from, to, key)).rejects.toThrow(
      'S3 unavailable',
    );
    expect(file?.state).toBe('deleting');
    expect(source).toBe(true);
    s3.on(AbortMultipartUploadCommand).callsFake(
      (input: AbortMultipartUploadCommandInput) => {
        uploads.delete(input.UploadId ?? '');
        return {};
      },
    );
    await deleteStagedFile(from, to, key);
    await deleteStagedFile(from, to, key);
    expect(snapshot()).toEqual({
      destination: undefined,
      file: undefined,
      source: false,
      uploads: 0,
    });
  });
  it('cleans an abandoned allocation without leaving its database record', async () => {
    await allocate();
    if (file) file.expiresAt = 0;
    await cleanupExpiredStagedFiles();
    expect(snapshot()).toEqual({
      destination: undefined,
      file: undefined,
      source: false,
      uploads: 0,
    });
  });

  it('cleans an interrupted transfer after the quarantine retention ends', async () => {
    await allocate();
    if (file) file.expiresAt = 0;
    beforeComplete = () => Promise.reject(new Error('worker interrupted'));
    await expect(moveStagedFile(from, to, key)).rejects.toThrow();
    await cleanupExpiredStagedFiles();
    expect(snapshot()).toEqual({
      destination: undefined,
      file: undefined,
      source: false,
      uploads: 0,
    });
  });

  it('preserves a ready file when cleanup reads an outdated pending index entry', async () => {
    await allocate();
    if (file) file.expiresAt = 0;
    const stale = structuredClone(file);
    await moveStagedFile(from, to, key);
    db.on(QueryCommand)
      .resolvesOnce({ Items: [stale as StagedFile] })
      .resolves({ Items: [] });
    await cleanupExpiredStagedFiles();
    expect(file?.state).toBe('ready');
    expect(destination).toBeDefined();
  });

  it('does not remove a completed copy when a duplicate scan rejects it', async () => {
    await allocate();
    await moveStagedFile(from, to, key);
    await deleteStagedFile(from, to, key, { pendingOnly: true });
    expect(file?.state).toBe('ready');
    expect(destination).toBeDefined();
  });

  it('resumes the registered transfer after a worker interruption', async () => {
    await allocate();
    beforeComplete = () => Promise.reject(new Error('worker interrupted'));
    await expect(moveStagedFile(from, to, key)).rejects.toThrow();
    beforeComplete = async () => {};
    await moveStagedFile(from, to, key);
    expect(file?.state).toBe('ready');
    expect(s3).toHaveReceivedCommandTimes(CreateMultipartUploadCommand, 1);
  });

  it('promotes an empty file without trying to copy an empty byte range', async () => {
    await allocate();
    s3.on(HeadObjectCommand, { Bucket: from }).resolves({
      ContentLength: 0,
      ETag: 'empty',
    });
    s3.on(UploadPartCommand).resolves({ ETag: 'empty-part' });
    await moveStagedFile(from, to, key);
    expect(file?.state).toBe('ready');
    expect(s3).not.toHaveReceivedCommand(UploadPartCopyCommand);
  });

  it('allows competing scan retries to finish only their registered transfer', async () => {
    await allocate();
    const gate = pause();
    beforeRegister = gate.wait;
    const first = moveStagedFile(from, to, key);
    await gate.reached;
    beforeRegister = async () => {};
    await moveStagedFile(from, to, key);
    gate.release();
    await first;
    expect(file?.state).toBe('ready');
    expect(destination).toBeDefined();
    expect(uploads.size).toBe(0);
  });

  it('retries expiry cleanup after cancelling a transfer initially fails', async () => {
    await allocate();
    if (file) file.expiresAt = 0;
    beforeComplete = () => Promise.reject(new Error('worker interrupted'));
    await expect(moveStagedFile(from, to, key)).rejects.toThrow();
    s3.on(AbortMultipartUploadCommand).rejects(new Error('S3 unavailable'));
    await expect(cleanupExpiredStagedFiles()).rejects.toThrow('S3 unavailable');
    expect(file?.state).toBe('deleting');
    s3.on(AbortMultipartUploadCommand).callsFake(
      (input: AbortMultipartUploadCommandInput) => {
        uploads.delete(input.UploadId ?? '');
        return {};
      },
    );
    await cleanupExpiredStagedFiles();
    expect(snapshot()).toEqual({
      destination: undefined,
      file: undefined,
      source: false,
      uploads: 0,
    });
  });
  it('recovers a wanted copy left behind when recording completion failed', async () => {
    await allocate();
    if (file) file.expiresAt = 0;
    beforeReady = () => Promise.reject(new Error('Database unavailable'));
    await expect(moveStagedFile(from, to, key)).rejects.toThrow(
      'Database unavailable',
    );
    expect(destination).toBeDefined();
    beforeReady = async () => {};
    await cleanupExpiredStagedFiles();
    expect(file?.state).toBe('ready');
    expect(file?.expiresAt).toBeUndefined();
    expect(destination).toBeDefined();
  });
});
