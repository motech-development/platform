import { S3 } from 'aws-sdk';
import { existsSync, mkdir } from 'fs';
import {
  createDirectory,
  createFile,
  deleteFile,
  moveFile,
} from '../file-operations';

jest.mock('fs');

describe('file-operations', () => {
  describe('createDirectory', () => {
    let name: string;

    beforeEach(() => {
      name = 'tmp';
    });

    it('should not create directory if it already exists', async () => {
      (existsSync as jest.Mock).mockReturnValueOnce(true);

      await createDirectory(name);

      expect(mkdir).not.toHaveBeenCalled();
    });

    it('should create directory if it exists', async () => {
      await createDirectory(name);

      expect(mkdir).toHaveBeenCalledWith('tmp', expect.any(Function));
    });
  });

  describe('createFile', () => {
    it('should putObject with the correct params', async () => {
      await createFile('bucket', 'file.txt', 'Hello world');

      expect(S3.prototype.putObject).toHaveBeenCalledWith({
        Body: 'Hello world',
        Bucket: 'bucket',
        Key: 'file.txt',
      });
    });
  });

  describe('deleteFile', () => {
    it('should deleteObject with the correct params', async () => {
      await deleteFile('bucket', 'file.txt');

      expect(S3.prototype.deleteObject).toHaveBeenCalledWith({
        Bucket: 'bucket',
        Key: 'file.txt',
      });
    });
  });

  describe('downloadFile', () => {
    it.todo('should getObject with the correct params');

    it.todo('should throw an error if file cannot be downloaded');
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

    it('should copyObject with the correct params', async () => {
      await moveFile(from, to, key);

      expect(S3.prototype.copyObject).toHaveBeenCalledWith({
        Bucket: 'download-bucket',
        CopySource: 'upload-bucket/test.pdf',
        Key: 'test.pdf',
      });
    });

    it('should deleteObject with the correct params', async () => {
      await moveFile(from, to, key);

      expect(S3.prototype.deleteObject).toHaveBeenCalledWith({
        Bucket: 'upload-bucket',
        Key: 'test.pdf',
      });
    });
  });
});
