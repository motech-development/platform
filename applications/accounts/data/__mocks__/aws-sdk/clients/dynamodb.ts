import { DocumentClient } from 'aws-sdk/clients/dynamodb';

DocumentClient.prototype.batchWrite = jest.fn().mockReturnValue({
  promise: jest.fn(),
});

DocumentClient.prototype.update = jest.fn().mockReturnValue({
  promise: jest.fn(),
});

DocumentClient.prototype.query = jest.fn().mockReturnValue({
  promise: jest.fn(),
});

module.exports = { DocumentClient };
