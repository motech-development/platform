import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { Readable } from 'node:stream';
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

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest
    .fn()
    .mockImplementation(
      (_, command: AwsCommand<ServiceInputTypes, ServiceOutputTypes>) => {
        Promise.resolve(s3.send(command)).catch(() => {});
      },
    ),
}));

jest.mock('node:fs', () => ({
  createWriteStream: jest.fn(),
  existsSync: jest.fn(),
  promises: {
    readFile: jest.fn().mockResolvedValue(null),
  },
}));

jest.mock('node:fs/promises', () => ({
  mkdir: jest.fn(),
}));

describe('s3-file-operations', () => {
  beforeEach(() => {
    s3.reset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createDirectory', () => {
    let name: string;

    beforeEach(() => {
      name = 'tmp';
    });

    describe('when directory exists', () => {
      beforeEach(() => {
        (existsSync as jest.Mock).mockReturnValueOnce(true);
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
        (existsSync as jest.Mock).mockReturnValueOnce(false);
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
