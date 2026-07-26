import type { NoParamCallback } from 'node:fs';
import tomlify from 'tomlify-j0.4';

tomlify.toToml = vi.fn();

vi.mock('node:fs', async (importOriginal) => ({
  ...(await importOriginal<typeof import('node:fs')>()),
  writeFile: vi.fn((_, __, callback: NoParamCallback) => callback(null)),
}));
