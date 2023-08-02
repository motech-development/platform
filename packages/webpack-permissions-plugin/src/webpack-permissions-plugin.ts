import { chmodSync, existsSync } from 'node:fs';
import { create } from 'filehound';
import { Compiler } from 'webpack';

interface IOptions {
  file: string;
  folders(compiler: Compiler): string[];
}

class WebpackPermissionsPlugin {
  private options: IOptions;

  constructor(options: IOptions) {
    this.options = options;
  }

  public apply(compiler: Compiler): void {
    compiler.hooks.done.tap('WebpackPermissionsPlugin', () => {
      const folders = this.options.folders(compiler);

      folders.forEach((folder) => this.setPermissions(folder));
    });
  }

  private setPermissions(path: string) {
    const pathExists = existsSync(path);

    if (!pathExists) {
      throw new Error(`${path} does not exist`);
    }

    const files = create().path(path).depth(0).findSync();

    files.forEach((file) => {
      chmodSync(file, this.options.file);
    });
  }
}

export default WebpackPermissionsPlugin;
