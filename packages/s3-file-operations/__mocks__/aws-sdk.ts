import * as AWS from 'aws-sdk';

AWS.S3.prototype.copyObject = jest.fn().mockReturnValue({
  promise: jest.fn(),
});

AWS.S3.prototype.deleteObject = jest.fn().mockReturnValue({
  promise: jest.fn(),
});

AWS.S3.prototype.deleteObjects = jest.fn().mockReturnValue({
  promise: jest.fn(),
});

AWS.S3.prototype.getObject = jest.fn().mockReturnValue({
  createReadStream: jest.fn(),
});

AWS.S3.prototype.headObject = jest.fn().mockReturnValue({
  promise: jest.fn(),
});

AWS.S3.prototype.listObjectsV2 = jest.fn().mockReturnValue({
  promise: jest.fn(),
});

AWS.S3.prototype.putObject = jest.fn().mockReturnValue({
  promise: jest.fn(),
});

AWS.S3.prototype.getSignedUrlPromise = jest.fn().mockReturnValue({
  promise: jest.fn(),
});

AWS.S3.prototype.upload = jest.fn().mockReturnValue({
  promise: jest.fn(),
});

module.exports = AWS;
