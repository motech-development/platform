import * as AWS from 'aws-sdk';

const mock = jest.fn().mockReturnValue({
  promise: jest.fn(),
});

AWS.StepFunctions.prototype.startExecution = mock;

module.exports = AWS;
