import * as AWS from 'aws-sdk';

const mock = jest.fn().mockReturnValue({
  promise: jest.fn(),
});

AWS.SQS.prototype.sendMessageBatch = mock;

AWS.S3.prototype.getSignedUrlPromise = jest
  .fn()
  .mockResolvedValue('https://signed-url');

module.exports = AWS;
