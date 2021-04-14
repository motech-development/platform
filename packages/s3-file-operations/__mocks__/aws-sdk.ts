import * as AWS from 'aws-sdk';

const mock = jest.fn().mockReturnValue({
  promise: jest.fn(),
});

AWS.S3.prototype.copyObject = mock;

AWS.S3.prototype.deleteObject = mock;

AWS.S3.prototype.getObject = jest.fn().mockReturnValue({
  createReadStream: jest.fn(),
});

AWS.S3.prototype.headObject = mock;

AWS.S3.prototype.putObject = mock;

AWS.S3.prototype.getSignedUrlPromise = mock;

AWS.S3.prototype.upload = mock;

module.exports = AWS;
