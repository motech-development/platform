import * as AWS from 'aws-sdk';

const mock = jest.fn().mockReturnValue({
  promise: jest.fn(),
});

AWS.S3.prototype.copyObject = mock;

AWS.S3.prototype.deleteObject = mock;

AWS.S3.prototype.putObject = mock;

AWS.StepFunctions.prototype.startExecution = mock;

module.exports = AWS;
