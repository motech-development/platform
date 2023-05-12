import { NoParamCallback } from 'node:fs';
import tomlify from 'tomlify-j0.4';

tomlify.toToml = jest.fn();

jest.mock('node:fs', () => ({
  writeFile: jest.fn((_, __, callback: NoParamCallback) => callback(null)),
}));
