import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const { STAGE } = process.env;

const documentClient =
  STAGE === 'local'
    ? new DocumentClient({
        endpoint: 'http://localhost:8000',
        region: 'localhost',
      })
    : new DocumentClient();

export default documentClient;
