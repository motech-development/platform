import { exec } from 'child_process';
import { join, resolve } from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const scanFile = async (file: string, outDir: string) => {
  const dataDir = resolve(outDir);
  const fileLocation = resolve(file);

  try {
    await execAsync(
      `./clamscan -v -a --stdout -d ${dataDir} '${fileLocation}'`,
    );

    return true;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('SCAN ERROR', e.message);

    return false;
  }
};

export const updateDefinitions = async (location: string) => {
  const dataDir = resolve(location);
  const cleanUp = join(dataDir, '*');

  await execAsync(`rm -rf ${cleanUp}`);

  await execAsync(
    `./freshclam --config-file=freshclam.conf --datadir=${dataDir}`,
  );
};
