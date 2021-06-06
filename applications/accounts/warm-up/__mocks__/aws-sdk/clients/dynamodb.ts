import { DocumentClient } from 'aws-sdk/clients/dynamodb';

DocumentClient.prototype.get = jest.fn().mockReturnValue({
  promise: jest.fn(),
});

DocumentClient.prototype.put = jest.fn().mockReturnValue({
  promise: jest.fn(),
});

module.exports = { DocumentClient };
