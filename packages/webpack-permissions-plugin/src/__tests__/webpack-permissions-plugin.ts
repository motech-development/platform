import { chmodSync, existsSync } from 'node:fs';
import { TapOptions } from 'tapable';
import type { Mock } from 'vitest';
import { Compiler, Stats } from 'webpack';
import PermissionsPlugin from '../webpack-permissions-plugin';

vi.mock('node:fs');
vi.mock('filehound', () => ({
  create: vi.fn().mockReturnValue({
    depth: vi.fn().mockReturnThis(),
    findSync: vi.fn().mockReturnValue(['mock-file.html']),
    path: vi.fn().mockReturnThis(),
  }),
}));

describe('webpack-permissions-plugin', () => {
  let compiler: Compiler;
  let permissionsPlugin: PermissionsPlugin;
  let pluginName: Mock;

  beforeEach(() => {
    compiler = {
      hooks: {
        done: {},
      },
    } as Compiler;

    pluginName = vi.fn();

    compiler.hooks.done.tap = (
      name: string | TapOptions,
      fn: (arg1: Stats, arg2: null, arg3: null) => void,
    ) => {
      pluginName(name);

      fn({} as Stats, null, null);
    };

    permissionsPlugin = new PermissionsPlugin({
      file: '755',
      folders: () => ['path/to/folder'],
    });
  });

  describe('when folder exists', () => {
    beforeEach(() => {
      (existsSync as Mock).mockReturnValue(true);
    });

    it('should have the correct plugin name', () => {
      permissionsPlugin.apply(compiler);

      expect(pluginName).toHaveBeenCalledWith('WebpackPermissionsPlugin');
    });

    it('should set the chmod for each file', () => {
      permissionsPlugin.apply(compiler);

      expect(chmodSync).toHaveBeenCalledWith('mock-file.html', '755');
    });
  });

  describe('when folder does not exist', () => {
    beforeEach(() => {
      (existsSync as Mock).mockReturnValue(false);
    });

    it('should throw an error if a directory does not exist', () => {
      expect(() => {
        permissionsPlugin.apply(compiler);
      }).toThrow('path/to/folder does not exist');
    });
  });
});
