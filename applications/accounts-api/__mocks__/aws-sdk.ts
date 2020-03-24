import * as AWS from 'aws-sdk';

const mock = jest.fn().mockReturnValue({
  promise: jest.fn(),
});

AWS.SQS.prototype.sendMessage = mock;

module.exports = AWS;
