import { SSM } from 'aws-sdk';
import axios from 'axios';

const authHeader = async () => {
  const { YapilyCredentials } = process.env;

  if (!YapilyCredentials) {
    throw new Error('No params passed');
  }

  // TODO: Cache SSM result
  const ssm = new SSM();

  const { Parameter } = await ssm
    .getParameter({
      Name: YapilyCredentials,
    })
    .promise();

  if (!Parameter || !Parameter.Value) {
    throw new Error('No credentials found');
  }

  const [YAPILY_APPLICATION_ID, YAPILY_APPLICATION_SECRET] =
    Parameter.Value.split(',');

  if (!YAPILY_APPLICATION_ID || !YAPILY_APPLICATION_SECRET) {
    throw new Error('No credentials set');
  }

  const token = Buffer.from(
    `${YAPILY_APPLICATION_ID}:${YAPILY_APPLICATION_SECRET}`,
  ).toString('base64');

  return `Basic ${token}`;
};

const httpClient = axios.create();

httpClient.defaults.baseURL = 'https://api.yapily.com';

httpClient.interceptors.request.use(async (config) => {
  const output = {
    ...config,
    headers: {
      ...config.headers,
      Authorization: await authHeader(),
    },
  };

  return output;
});

export default httpClient;
