import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const documentClient = (): DocumentClient => {
  const { STAGE } = process.env;

  return STAGE === 'local'
    ? new DocumentClient({
        endpoint: 'http://localhost:8000',
        region: 'localhost',
      })
    : new DocumentClient();
};

export default documentClient;
