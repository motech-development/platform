import { DocumentClient } from 'aws-sdk/clients/dynamodb';

DocumentClient.prototype.query = jest.fn().mockReturnValue({
  promise: jest.fn(),
});

module.exports = { DocumentClient };
