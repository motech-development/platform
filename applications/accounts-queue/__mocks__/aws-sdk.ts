import * as AWS from 'aws-sdk';

AWS.StepFunctions.prototype.startExecution = jest.fn().mockReturnValue({
  promise: jest.fn(),
});

module.exports = AWS;
