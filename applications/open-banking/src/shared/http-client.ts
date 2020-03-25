import axios from 'axios';

const authHeader = () => {
  // TODO: Use param store
  const { YAPILY_APPLICATION_ID, YAPILY_APPLICATION_SECRET } = process.env;

  if (!YAPILY_APPLICATION_ID || !YAPILY_APPLICATION_SECRET) {
    throw new Error('No credentials set');
  }

  const token = Buffer.from(
    `${YAPILY_APPLICATION_ID}:${YAPILY_APPLICATION_SECRET}`,
  ).toString('base64');

  return `Basic ${token}`;
};

const httpClient = axios;

httpClient.defaults.baseURL = 'https://api.yapily.com';

httpClient.interceptors.request.use(
  config => {
    const output = {
      ...config,
    };

    output.headers.Authorization = authHeader();

    return output;
  },
  error => Promise.reject(error),
);

export default httpClient;
