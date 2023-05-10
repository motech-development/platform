import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const documentClient = (): DynamoDBClient => {
  const { STAGE } = process.env;

  return STAGE === 'local'
    ? new DynamoDBClient({
        endpoint: 'http://localhost:8000',
        region: 'localhost',
      })
    : new DynamoDBClient({});
};

export default documentClient;
