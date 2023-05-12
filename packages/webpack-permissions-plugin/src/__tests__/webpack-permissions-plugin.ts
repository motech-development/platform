import { chmodSync, existsSync } from 'node:fs';
import { TapOptions } from 'tapable';
import { Compiler, Stats } from 'webpack';
import PermissionsPlugin from '../webpack-permissions-plugin';

jest.mock('fs');
jest.mock('filehound', () => ({
  create: jest.fn().mockReturnValue({
    depth: jest.fn().mockReturnThis(),
    findSync: jest.fn().mockReturnValue(['mock-file.html']),
    path: jest.fn().mockReturnThis(),
  }),
}));

describe('webpack-permissions-plugin', () => {
  let compiler: Compiler;
  let permissionsPlugin: PermissionsPlugin;
  let pluginName: jest.Mock;

  beforeEach(() => {
    compiler = {
      hooks: {
        done: {},
      },
    } as Compiler;

    pluginName = jest.fn();

    compiler.hooks.done.tap = (
      name: string | TapOptions<'sync', Stats, null, null>,
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
      (existsSync as jest.Mock).mockReturnValue(true);
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
      (existsSync as jest.Mock).mockReturnValue(false);
    });

    it('should throw an error if a directory does not exist', () => {
      expect(() => {
        permissionsPlugin.apply(compiler);
      }).toThrow('path/to/folder does not exist');
    });
  });
});
