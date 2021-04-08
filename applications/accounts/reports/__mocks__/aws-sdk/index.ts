import * as AWS from 'aws-sdk';

AWS.SQS.prototype.sendMessageBatch = jest.fn().mockReturnValue({
  promise: jest.fn(),
});

module.exports = AWS;
