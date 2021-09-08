import logger from '@motech-development/logger';
import { execFile } from 'child_process';
import { join, resolve } from 'path';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export const scanFile = async (file: string, outDir: string) => {
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

export const updateDefinitions = async (location: string) => {
  const dataDir = resolve(location);
  const cleanUp = join(dataDir, '*');

  await execFileAsync('rm', ['-rf', cleanUp]);

  const { stderr, stdout } = await execFileAsync('./freshclam', [
    '--config-file=freshclam.conf',
    `--datadir=${dataDir}`,
  ]);

  if (stderr) {
    logger.error(stderr);
  }

  if (stdout) {
    logger.info(stdout);
  }
};
