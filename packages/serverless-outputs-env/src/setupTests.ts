import tomlify from 'tomlify-j0.4';

tomlify.toToml = jest.fn();

jest.mock('fs', () => ({
  writeFile: jest.fn((_, __, callback) => callback(null, true)),
}));
