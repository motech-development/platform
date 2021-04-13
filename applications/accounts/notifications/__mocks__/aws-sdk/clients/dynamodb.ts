import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const mock = jest.fn().mockReturnValue({
  promise: jest.fn(),
});

DocumentClient.prototype.put = mock;

module.exports = { DocumentClient };
