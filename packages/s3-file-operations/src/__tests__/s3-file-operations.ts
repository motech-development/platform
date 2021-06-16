import { S3 } from 'aws-sdk';
import { existsSync, mkdir } from 'fs';
import {
  createDirectory,
  createFile,
  createSignedUrl,
  deleteFile,
  downloadFileStream,
  getFileData,
  moveFile,
  removeFolder,
  uploader,
} from '../s3-file-operations';

jest.mock('fs');

describe('s3-file-operations', () => {
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

        expect(mkdir).toHaveBeenCalledWith('tmp', expect.any(Function));
      });

      it('should return false', async () => {
        await expect(createDirectory(name)).resolves.toEqual(false);
      });
    });
  });

  describe('createFile', () => {
    it('should call putObject with the correct params', async () => {
      await createFile('bucket', 'file.txt', 'Hello world');

      expect(S3.prototype.putObject).toHaveBeenCalledWith({
        Body: 'Hello world',
        Bucket: 'bucket',
        Key: 'file.txt',
      });
    });
  });

  describe('createSignedUrl', () => {
    it('should call getSignedUrlPromise with the correct params', async () => {
      await createSignedUrl('getObject', 'bucket', 'file.txt', 100);

      expect(S3.prototype.getSignedUrlPromise).toHaveBeenCalledWith(
        'getObject',
        {
          Bucket: 'bucket',
          Expires: 100,
          Key: 'file.txt',
        },
      );
    });

    it('should call getSignedUrlPromise with the correct additional params', async () => {
      await createSignedUrl('getObject', 'bucket', 'file.txt', 100, {
        ContentType: 'application/pdf',
      });

      expect(S3.prototype.getSignedUrlPromise).toHaveBeenCalledWith(
        'getObject',
        {
          Bucket: 'bucket',
          ContentType: 'application/pdf',
          Expires: 100,
          Key: 'file.txt',
        },
      );
    });
  });

  describe('deleteFile', () => {
    it('should call deleteObject with the correct params', async () => {
      await deleteFile('bucket', 'file.txt');

      expect(S3.prototype.deleteObject).toHaveBeenCalledWith({
        Bucket: 'bucket',
        Key: 'file.txt',
      });
    });
  });

  describe('downloadFileStream', () => {
    it('should call getObject with the correct params', () => {
      downloadFileStream('bucket', 'file.txt');

      expect(S3.prototype.getObject).toHaveBeenCalledWith({
        Bucket: 'bucket',
        Key: 'file.txt',
      });
    });
  });

  describe('downloadFile', () => {
    it.todo('should throw an error if file cannot be downloaded');
  });

  describe('getFileData', () => {
    it('should call headObject with the correct params', async () => {
      await getFileData('bucket', 'file.txt');

      expect(S3.prototype.headObject).toHaveBeenCalledWith({
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

      expect(S3.prototype.copyObject).toHaveBeenCalledWith({
        Bucket: 'download-bucket',
        CopySource: 'upload-bucket/test.pdf',
        Key: 'test.pdf',
      });
    });

    it('should call deleteObject with the correct params', async () => {
      await moveFile(from, to, key);

      expect(S3.prototype.deleteObject).toHaveBeenCalledWith({
        Bucket: 'upload-bucket',
        Key: 'test.pdf',
      });
    });
  });

  describe('removeFolder', () => {
    beforeEach(() => {
      (S3.prototype.listObjectsV2 as jest.Mock).mockReturnValue({
        promise: jest.fn().mockResolvedValue({
          Contents: [],
        }),
      });
    });

    it('should call listObjectsV2 with the correct params', async () => {
      await removeFolder('bucket', '/test');

      expect(S3.prototype.listObjectsV2).toHaveBeenCalledWith({
        Bucket: 'bucket',
        Prefix: '/test',
      });
    });

    it('should do nothing if no files found', async () => {
      await removeFolder('bucket', '/test');

      expect(S3.prototype.deleteObjects).not.toHaveBeenCalled();
    });

    it('should delete the correct objects', async () => {
      (S3.prototype.listObjectsV2 as jest.Mock).mockReturnValue({
        promise: jest.fn().mockResolvedValue({
          Contents: [
            {
              Key: '/test/test-1.pdf',
            },
          ],
          IsTruncated: false,
        }),
      });

      await removeFolder('bucket', '/test');

      expect(S3.prototype.deleteObjects).toHaveBeenCalledWith({
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
      (S3.prototype.listObjectsV2 as jest.Mock).mockReturnValue({
        promise: jest
          .fn()
          .mockResolvedValueOnce({
            Contents: [
              {
                Key: '/test/test-1.pdf',
              },
            ],
            IsTruncated: true,
          })
          .mockResolvedValueOnce({
            Contents: [
              {
                Key: '/test/test-2.pdf',
              },
            ],
            IsTruncated: false,
          }),
      });

      await removeFolder('bucket', '/test');

      expect(S3.prototype.deleteObjects).toHaveBeenCalledTimes(2);
    });
  });

  describe('uploader', () => {
    it('should call upload with the correct params', () => {
      uploader('bucket', 'file.txt', 'hello world', 'text/plain');

      expect(S3.prototype.upload).toHaveBeenCalledWith({
        Body: 'hello world',
        Bucket: 'bucket',
        ContentType: 'text/plain',
        Key: 'file.txt',
      });
    });
  });
});
