const axios = {
  create: jest.fn().mockReturnThis(),
  interceptors: {
    request: {
      use: jest.fn(),
    },
  },
  request: jest.fn(),
};

module.exports = axios;
