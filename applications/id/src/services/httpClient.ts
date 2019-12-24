import axios from 'axios';

const httpClient = axios;
const { AUTH_DOMAIN, NODE_ENV } = process.env;

httpClient.defaults.baseURL = NODE_ENV === 'production' ? AUTH_DOMAIN : '/';

httpClient.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error.response.data),
);

export default httpClient;
