import { fromNodeProviderChain } from '@aws-sdk/credential-providers';
import { AWSAppSyncClient } from 'aws-appsync';

const createAppSyncClient = () => {
  const { AWS_REGION, ENDPOINT } = process.env;

  if (!AWS_REGION) {
    throw new Error('No region set');
  }

  if (!ENDPOINT) {
    throw new Error('No endpoint set');
  }

  return new AWSAppSyncClient({
    auth: {
      credentials: fromNodeProviderChain({}),
      type: 'AWS_IAM',
    },
    disableOffline: true,
    region: AWS_REGION,
    url: ENDPOINT,
  });
};

export default createAppSyncClient;
