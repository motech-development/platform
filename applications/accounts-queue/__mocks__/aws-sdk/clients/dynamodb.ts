import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const mock = jest.fn().mockReturnValue({
  promise: jest.fn(),
});

DocumentClient.prototype.batchWrite = mock;

DocumentClient.prototype.delete = mock;

DocumentClient.prototype.get = mock;

export { DocumentClient };
