import { createWriteStream, existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { Readable, Writable } from 'node:stream';
import {
  CopyObjectCommand,
  CreateMultipartUploadCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
  ServiceInputTypes,
  ServiceOutputTypes,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { sdkStreamMixin } from '@aws-sdk/util-stream-node';
import { AwsCommand, mockClient } from 'aws-sdk-client-mock';
import type { Mock } from 'vitest';
import {
  createDirectory,
  createFile,
  createSignedUrl,
  deleteFile,
  downloadFile,
  downloadFileStream,
  getFileData,
  moveFile,
  removeFolder,
  uploader,
} from '../s3-file-operations';

const s3 = mockClient(S3Client);

vi.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: vi
    .fn()
    .mockImplementation(
      (_, command: AwsCommand<ServiceInputTypes, ServiceOutputTypes>) => {
        Promise.resolve(s3.send(command)).catch(() => {});
      },
    ),
}));

vi.mock('node:fs', async (importOriginal) => ({
  ...(await importOriginal<typeof import('node:fs')>()),
  createWriteStream: vi.fn(),
  existsSync: vi.fn(),
  promises: {
    readFile: vi.fn().mockResolvedValue(null),
  },
}));

vi.mock('node:fs/promises', async (importOriginal) => ({
  ...(await importOriginal<typeof import('node:fs/promises')>()),
  mkdir: vi.fn(),
}));

describe('s3-file-operations', () => {
  beforeEach(() => {
    s3.reset();
    s3.on(DeleteObjectsCommand).resolves({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('createDirectory', () => {
    let name: string;

    beforeEach(() => {
      name = 'tmp';
    });

    describe('when directory exists', () => {
      beforeEach(() => {
        (existsSync as Mock).mockReturnValueOnce(true);
      });

      it('should not create directory', async () => {
        await createDirectory(name);

        expect(mkdir).not.toHaveBeenCalled();
      });

      it('should return true', async () => {
        await expect(createDirectory(name)).resolves.toEqual(true);
      });
    });

    describe('when directory does not exist', () => {
      beforeEach(() => {
        (existsSync as Mock).mockReturnValueOnce(false);
      });

      it('should create directory', async () => {
        await createDirectory(name);

        expect(mkdir).toHaveBeenCalledWith('tmp');
      });

      it('should return false', async () => {
        await expect(createDirectory(name)).resolves.toEqual(false);
      });
    });
  });

  describe('createFile', () => {
    it('should call putObject with the correct params', async () => {
      await createFile('bucket', 'file.txt', 'Hello world');

      expect(s3).toHaveReceivedCommandWith(PutObjectCommand, {
        Body: 'Hello world',
        Bucket: 'bucket',
        Key: 'file.txt',
      });
    });
  });

  describe('createSignedUrl', () => {
    it('should call getSignedUrlPromise with the correct params when getting an object', async () => {
      await createSignedUrl('getObject', 'bucket', 'file.txt', 100);

      expect(s3).toHaveReceivedCommandWith(GetObjectCommand, {
        Bucket: 'bucket',
        Key: 'file.txt',
      });

      expect(getSignedUrl).toHaveBeenCalledWith(
        expect.any(S3Client),
        expect.any(GetObjectCommand),
        {
          expiresIn: 100,
        },
      );
    });

    it('should call getSignedUrlPromise with the correct additional params when getting an object', async () => {
      await createSignedUrl('getObject', 'bucket', 'file.txt', 100, {
        ContentType: 'application/pdf',
      });

      expect(s3).toHaveReceivedCommandWith(GetObjectCommand, {
        Bucket: 'bucket',
        Key: 'file.txt',
      });

      expect(getSignedUrl).toHaveBeenCalledWith(
        expect.any(S3Client),
        expect.any(GetObjectCommand),
        {
          expiresIn: 100,
        },
      );
    });

    it('should call getSignedUrlPromise with the correct params when putting an object', async () => {
      await createSignedUrl('putObject', 'bucket', 'file.txt', 100);

      expect(s3).toHaveReceivedCommandWith(PutObjectCommand, {
        Bucket: 'bucket',
        Key: 'file.txt',
      });

      expect(getSignedUrl).toHaveBeenCalledWith(
        expect.any(S3Client),
        expect.any(PutObjectCommand),
        {
          expiresIn: 100,
        },
      );
    });

    it('should call getSignedUrlPromise with the correct additional params when putting an object', async () => {
      await createSignedUrl('putObject', 'bucket', 'file.txt', 100, {
        ContentType: 'application/pdf',
      });

      expect(s3).toHaveReceivedCommandWith(PutObjectCommand, {
        Bucket: 'bucket',
        ContentType: 'application/pdf',
        Key: 'file.txt',
      });

      expect(getSignedUrl).toHaveBeenCalledWith(
        expect.any(S3Client),
        expect.any(PutObjectCommand),
        {
          expiresIn: 100,
        },
      );
    });
  });

  describe('deleteFile', () => {
    it('should call deleteObject with the correct params', async () => {
      await deleteFile('bucket', 'file.txt');

      expect(s3).toHaveReceivedCommandWith(DeleteObjectCommand, {
        Bucket: 'bucket',
        Key: 'file.txt',
      });
    });
  });

  describe('downloadFileStream', () => {
    it('should call getObject with the correct params', async () => {
      s3.on(GetObjectCommand).resolves({
        Body: sdkStreamMixin(new Readable()),
      });

      await downloadFileStream('bucket', 'file.txt');

      expect(s3).toHaveReceivedCommandWith(GetObjectCommand, {
        Bucket: 'bucket',
        Key: 'file.txt',
      });
    });
  });

  describe('downloadFile', () => {
    it('should throw an error if file cannot be downloaded', async () => {
      await expect(
        downloadFile('upload-bucket', 'file.txt', 'download-bucket'),
      ).rejects.toThrow('Unable to stream file');

      expect(createWriteStream).not.toHaveBeenCalled();
    });

    it('should wait until the destination finishes writing', async () => {
      let releaseWrite!: () => void;
      let notifyWriteStarted!: () => void;
      let settled = false;
      const writeStarted = new Promise<void>((resolve) => {
        notifyWriteStarted = resolve;
      });
      const source = sdkStreamMixin(Readable.from(['file contents']));
      const destination = new Writable({
        write(_chunk, _encoding, callback) {
          notifyWriteStarted();
          releaseWrite = () => callback();
        },
      });

      s3.on(GetObjectCommand).resolves({
        Body: source,
      });
      (createWriteStream as Mock).mockReturnValueOnce(destination);

      const download = downloadFile('bucket', 'file.txt', 'download-bucket');
      const didSettle = download.then(() => {
        settled = true;
      });

      await writeStarted;

      expect(settled).toBe(false);

      releaseWrite();

      await expect(download).resolves.toEqual('download-bucket/file.txt');
      await didSettle;
    });

    it('should reject when the source stream fails', async () => {
      let sentContents = false;
      const source = sdkStreamMixin(
        new Readable({
          read() {
            if (sentContents) {
              return;
            }

            sentContents = true;
            this.push('partial contents');
            process.nextTick(() => this.destroy(new Error('source failed')));
          },
        }),
      );
      const destination = new Writable({
        write(_chunk, _encoding, callback) {
          callback();
        },
      });

      s3.on(GetObjectCommand).resolves({
        Body: source,
      });
      (createWriteStream as Mock).mockReturnValueOnce(destination);

      await expect(
        downloadFile('bucket', 'file.txt', 'download-bucket'),
      ).rejects.toThrow('source failed');
    });

    it('should reject when the destination stream fails', async () => {
      const source = sdkStreamMixin(Readable.from(['file contents']));
      const destination = new Writable({
        write(_chunk, _encoding, callback) {
          callback(new Error('destination failed'));
        },
      });

      s3.on(GetObjectCommand).resolves({
        Body: source,
      });
      (createWriteStream as Mock).mockReturnValueOnce(destination);

      await expect(
        downloadFile('bucket', 'file.txt', 'download-bucket'),
      ).rejects.toThrow('destination failed');
    });
  });

  describe('getFileData', () => {
    it('should call headObject with the correct params', async () => {
      await getFileData('bucket', 'file.txt');

      expect(s3).toHaveReceivedCommandWith(HeadObjectCommand, {
        Bucket: 'bucket',
        Key: 'file.txt',
      });
    });
  });

  describe('moveFile', () => {
    let from: string;
    let to: string;
    let key: string;

    beforeEach(() => {
      from = 'upload-bucket';
      to = 'download-bucket';
      key = 'test.pdf';
    });

    it('should call copyObject with the correct params', async () => {
      await moveFile(from, to, key);

      expect(s3).toHaveReceivedCommandWith(CopyObjectCommand, {
        Bucket: 'download-bucket',
        CopySource: 'upload-bucket/test.pdf',
        Key: 'test.pdf',
      });
    });

    it('should call deleteObject with the correct params', async () => {
      await moveFile(from, to, key);

      expect(s3).toHaveReceivedCommandWith(DeleteObjectCommand, {
        Bucket: 'upload-bucket',
        Key: 'test.pdf',
      });
    });

    it('should use the injected client for copy and deletion', async () => {
      const customClient = new S3Client({});
      const customS3 = mockClient(customClient);
      customS3.on(CopyObjectCommand).resolves({});
      customS3.on(DeleteObjectCommand).resolves({});

      await moveFile(from, to, key, customClient);

      expect(customS3).toHaveReceivedCommand(CopyObjectCommand);
      expect(customS3).toHaveReceivedCommandWith(DeleteObjectCommand, {
        Bucket: from,
        Key: key,
      });
      expect(s3).not.toHaveReceivedCommand(DeleteObjectCommand);

      customS3.restore();
    });

    it('should not delete the source if copying fails', async () => {
      s3.on(CopyObjectCommand).rejects(new Error('copy failed'));

      await expect(moveFile(from, to, key)).rejects.toThrow('copy failed');

      expect(s3).not.toHaveReceivedCommand(DeleteObjectCommand);
    });
  });

  describe('removeFolder', () => {
    beforeEach(() => {
      s3.on(ListObjectsV2Command).resolves({
        Contents: [],
      });
    });

    it('should call listObjectsV2 with the correct params', async () => {
      await removeFolder('bucket', '/test');

      expect(s3).toReceiveCommandWith(ListObjectsV2Command, {
        Bucket: 'bucket',
        Prefix: '/test',
      });
    });

    it('should do nothing if no files found', async () => {
      await removeFolder('bucket', '/test');

      expect(s3).not.toReceiveCommand(DeleteObjectCommand);
    });

    it('should delete the correct objects', async () => {
      s3.on(ListObjectsV2Command).resolves({
        Contents: [
          {
            Key: '/test/test-1.pdf',
          },
        ],
        IsTruncated: false,
      });

      await removeFolder('bucket', '/test');

      expect(s3).toReceiveCommandWith(DeleteObjectsCommand, {
        Bucket: 'bucket',
        Delete: {
          Objects: [
            {
              Key: '/test/test-1.pdf',
            },
          ],
        },
      });
    });

    it('should call deleteObjects the correct number of times if listObjects is truncated', async () => {
      s3.on(ListObjectsV2Command)
        .resolvesOnce({
          Contents: [
            {
              Key: '/test/test-1.pdf',
            },
          ],
          IsTruncated: true,
          NextContinuationToken: 'next-page',
        })
        .resolvesOnce({
          Contents: [
            {
              Key: '/test/test-2.pdf',
            },
          ],
          IsTruncated: false,
        });

      await removeFolder('bucket', '/test');

      expect(s3).toReceiveCommandTimes(DeleteObjectsCommand, 2);
    });

    it('should continue listing after an empty truncated page', async () => {
      const customClient = new S3Client({});
      const customS3 = mockClient(customClient);
      customS3.on(DeleteObjectsCommand).resolves({});
      customS3
        .on(ListObjectsV2Command)
        .resolvesOnce({
          Contents: [],
          IsTruncated: true,
          NextContinuationToken: 'next-page',
        })
        .resolvesOnce({
          Contents: [
            {
              Key: '/test/test-1.pdf',
            },
          ],
          IsTruncated: true,
          NextContinuationToken: 'last-page',
        })
        .resolvesOnce({
          Contents: [],
          IsTruncated: false,
        });

      await removeFolder('bucket', '/test', customClient);

      expect(customS3).toReceiveCommandTimes(ListObjectsV2Command, 3);
      expect(customS3).toReceiveCommandTimes(DeleteObjectsCommand, 1);
      expect(customS3).toHaveReceivedCommandWith(ListObjectsV2Command, {
        Bucket: 'bucket',
        ContinuationToken: 'next-page',
        Prefix: '/test',
      });
      expect(customS3).toHaveReceivedCommandWith(ListObjectsV2Command, {
        Bucket: 'bucket',
        ContinuationToken: 'last-page',
        Prefix: '/test',
      });
      expect(s3).not.toHaveReceivedCommand(ListObjectsV2Command);

      customS3.restore();
    });

    it('should limit each delete request to 1000 objects', async () => {
      s3.on(ListObjectsV2Command).resolves({
        Contents: Array.from({ length: 1001 }, (_, index) => ({
          Key: `/test/test-${index}.pdf`,
        })),
        IsTruncated: false,
      });

      await removeFolder('bucket', '/test');

      const deleteCommands = s3.commandCalls(DeleteObjectsCommand);

      expect(deleteCommands).toHaveLength(2);
      expect(deleteCommands[0].args[0].input.Delete?.Objects).toHaveLength(
        1000,
      );
      expect(deleteCommands[1].args[0].input.Delete?.Objects).toHaveLength(1);
    });

    it('should reject when S3 reports an object deletion error', async () => {
      s3.on(ListObjectsV2Command).resolves({
        Contents: [
          {
            Key: '/test/test-1.pdf',
          },
        ],
      });
      s3.on(DeleteObjectsCommand).resolves({
        Errors: [
          {
            Code: 'AccessDenied',
            Key: '/test/test-1.pdf',
            Message: 'Access denied',
          },
        ],
      });

      await expect(removeFolder('bucket', '/test')).rejects.toThrow(
        'Failed to delete S3 objects: /test/test-1.pdf: AccessDenied (Access denied)',
      );
    });
  });

  describe('uploader', () => {
    beforeEach(() => {
      s3.on(CreateMultipartUploadCommand).resolves({
        UploadId: '1',
      });

      s3.on(UploadPartCommand).resolves({
        ETag: '1',
      });
    });

    it('should call upload with the correct params', async () => {
      const stream = new Readable();

      stream.push('hello world');

      stream.push(null);

      const result = await uploader(
        'bucket',
        'file.txt',
        stream,
        'text/plain',
        new S3Client({
          region: 'eu-west-1',
        }),
      ).done();

      expect(result).toEqual({
        Bucket: 'bucket',
        Key: 'file.txt',
        Location: 'https://bucket.s3.eu-west-1.amazonaws.com/file.txt',
      });
    });
  });
});
