import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import documentClient from '../document-client';

describe('document-client', () => {
  it('should return an instance of DocumentClient', () => {
    const result = documentClient();

    expect(result).toBeInstanceOf(DynamoDBClient);
  });

  describe('when stage is local', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.STAGE = 'local';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should return an instance of DocumentClient', () => {
      const result = documentClient();

      expect(result).toBeInstanceOf(DynamoDBClient);
    });
  });
});
