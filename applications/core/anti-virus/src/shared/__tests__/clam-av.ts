import childProcess, { ChildProcess } from 'node:child_process';
import { scanFile, updateDefinitions } from '../clam-av';

const childProcessMock = vi.hoisted(() => {
  type TResult = (Error | string | undefined)[];
  type TCallback = (...result: TResult) => void;

  let result: TResult = [undefined, 'true', undefined];

  return {
    execFile: vi.fn((_: unknown, __: unknown, callback: TCallback) =>
      callback(...result),
    ),
    setExecFile(success: boolean) {
      result = success
        ? [undefined, 'true', undefined]
        : [new Error(), undefined, 'false'];
    },
  };
});

vi.mock('node:child_process', async (importOriginal) => {
  const childProcessModule =
    await importOriginal<typeof import('node:child_process')>();

  return {
    ...childProcessModule,
    ...childProcessMock,
    default: {
      ...childProcessModule,
      ...childProcessMock,
    },
  };
});

interface IChildProcess extends ChildProcess {
  setExecFile(pass: boolean): void;
}

describe('clam-av', () => {
  describe('scanFile', () => {
    let file: string;
    let outDir: string;

    beforeEach(() => {
      file = '/tmp/downloads/file.pdf';
      outDir = '/tmp';
    });

    it('should execute the correct command', async () => {
      await scanFile(file, outDir);

      expect(childProcess.execFile).toHaveBeenCalledWith(
        './clamscan',
        ['-v', '-a', '--stdout', '-d', '/tmp', '/tmp/downloads/file.pdf'],
        expect.any(Function),
      );
    });

    it('should return true if file is safe', async () => {
      await expect(scanFile(file, outDir)).resolves.toEqual(true);
    });

    it('should return false if file is not safe', async () => {
      (childProcess as unknown as IChildProcess).setExecFile(false);

      await expect(scanFile(file, outDir)).resolves.toEqual(false);
    });
  });

  describe('updateDefinitions', () => {
    let location: string;

    beforeEach(() => {
      location = '/tmp';

      (childProcess as unknown as IChildProcess).setExecFile(true);
    });

    it('should delete the data directory', async () => {
      await updateDefinitions(location);

      expect(childProcess.execFile).toHaveBeenCalledWith(
        'rm',
        ['-rf', '/tmp/*'],
        expect.any(Function),
      );
    });

    it('should execute the correct command', async () => {
      await updateDefinitions(location);

      expect(childProcess.execFile).toHaveBeenCalledWith(
        './freshclam',
        ['--config-file=freshclam.conf', '--datadir=/tmp'],
        expect.any(Function),
      );
    });
  });
});
