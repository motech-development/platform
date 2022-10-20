const fs =
  jest.genMockFromModule<{
    mkdir: jest.Mock;
  }>('fs');

fs.mkdir = jest.fn((_, callback) => callback());

module.exports = fs;
