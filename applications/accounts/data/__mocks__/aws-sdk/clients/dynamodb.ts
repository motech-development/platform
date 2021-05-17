import { DocumentClient } from 'aws-sdk/clients/dynamodb';

DocumentClient.prototype.update = jest.fn().mockReturnValue({
  promise: jest.fn(),
});

DocumentClient.prototype.put = jest.fn().mockReturnValue({
  promise: jest.fn(),
});

DocumentClient.prototype.query = jest.fn().mockReturnValue({
  promise: jest.fn(),
});

module.exports = { DocumentClient };
