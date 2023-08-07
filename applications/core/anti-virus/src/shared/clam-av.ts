import { execFile } from 'node:child_process';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';
import logger from '@motech-development/node-logger';

const execFileAsync = promisify(execFile);

export const scanFile = async (
  file: string,
  outDir: string,
): Promise<boolean> => {
  const dataDir = resolve(outDir);
  const fileLocation = resolve(file);

  try {
    await execFileAsync('./clamscan', [
      '-v',
      '-a',
      '--stdout',
      '-d',
      dataDir,
      fileLocation,
    ]);

    return true;
  } catch (e) {
    // eslint-disable-next-line no-console
    logger.error(e);

    return false;
  }
};

export const updateDefinitions = async (location: string): Promise<void> => {
  const dataDir = resolve(location);
  const cleanUp = join(dataDir, '*');

  await execFileAsync('rm', ['-rf', cleanUp]);

  await execFileAsync('./freshclam', [
    '--config-file=freshclam.conf',
    `--datadir=${dataDir}`,
  ]);
};
