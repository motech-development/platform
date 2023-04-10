const axios =
  jest.createMockFromModule<{
    create: jest.Mock;
  }>('axios');

axios.create = jest.fn(() => axios);

module.exports = axios;

export {};
