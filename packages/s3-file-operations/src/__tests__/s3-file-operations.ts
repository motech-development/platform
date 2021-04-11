import { S3 } from 'aws-sdk';
import { existsSync, mkdir } from 'fs';
import {
  createDirectory,
  createFile,
  createSignedUrl,
  deleteFile,
  getFileData,
  moveFile,
} from '../s3-file-operations';

jest.mock('fs');

describe('file-operations', () => {
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

  describe('downloadFile', () => {
    it.todo('should call getObject with the correct params');

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
});
