import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import documentClient from '../document-client';

describe('document-client', () => {
  it('should return an instance of DocumentClient', () => {
    expect(documentClient).toBeInstanceOf(DocumentClient);
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
      expect(documentClient).toBeInstanceOf(DocumentClient);
    });
  });
});
