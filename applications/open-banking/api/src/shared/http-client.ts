import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import axios from 'axios';

export const getErrorStatus = (e: unknown): number => {
  let status = 500;

  if (axios.isAxiosError(e)) {
    status = e.response?.status || 500;
  }

  return status;
};

const authHeader = async () => {
  const { YapilyCredentials } = process.env;

  if (!YapilyCredentials) {
    throw new Error('No params passed');
  }

  // TODO: Cache SSM result
  const ssm = new SSMClient({});

  const command = new GetParameterCommand({
    Name: YapilyCredentials,
  });

  const { Parameter } = await ssm.send(command);

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
