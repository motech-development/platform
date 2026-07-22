import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import {
  access,
  chmod,
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const antiVirusDirectory = fileURLToPath(
  new URL('../../applications/core/anti-virus/', import.meta.url),
);

async function createAntiVirusFixture() {
  const directory = await mkdtemp(join(tmpdir(), 'anti-virus-cache-'));

  for (const relativePath of [
    'build-inputs.env',
    'scripts/build.sh',
    'scripts/cache.sh',
  ]) {
    const destination = join(directory, relativePath);
    await mkdir(dirname(destination), { recursive: true });
    await copyFile(join(antiVirusDirectory, relativePath), destination);
  }

  const fakeBin = join(directory, 'fake-bin');
  await mkdir(fakeBin);
  await writeFile(
    join(fakeBin, 'docker'),
    '#!/usr/bin/env bash\nprintf \'%s\\n\' "$*" >> "$DOCKER_LOG"\nexit 97\n',
  );
  await chmod(join(fakeBin, 'docker'), 0o755);

  return {
    directory,
    dockerLog: join(directory, 'docker.log'),
    env: {
      ...process.env,
      DOCKER_LOG: join(directory, 'docker.log'),
      PATH: `${fakeBin}:${process.env.PATH}`,
    },
  };
}

async function createValidCache(directory) {
  const binaryDirectory = join(directory, 'bin');
  await mkdir(binaryDirectory);
  await writeFile(join(binaryDirectory, 'clamscan'), 'clamscan binary\n');
  await writeFile(join(binaryDirectory, 'freshclam'), 'freshclam binary\n');
  await writeFile(join(binaryDirectory, 'libclamav.so'), 'shared library\n');
  await chmod(join(binaryDirectory, 'clamscan'), 0o755);
  await chmod(join(binaryDirectory, 'freshclam'), 0o755);
  await chmod(join(binaryDirectory, 'libclamav.so'), 0o644);
  await execFileAsync('bash', ['scripts/cache.sh', 'write'], {
    cwd: directory,
  });
}

test('a complete cache hit skips the ClamAV source build', async () => {
  const fixture = await createAntiVirusFixture();

  try {
    await createValidCache(fixture.directory);

    const { stdout } = await execFileAsync('bash', ['scripts/build.sh'], {
      cwd: fixture.directory,
      env: fixture.env,
    });

    assert.match(stdout, /Using validated cached ClamAV binaries/);
    await assert.rejects(access(fixture.dockerLog), { code: 'ENOENT' });
    assert.equal(
      await readFile(join(fixture.directory, 'bin', 'libclamav.so'), 'utf8'),
      'shared library\n',
    );
  } finally {
    await rm(fixture.directory, { recursive: true });
  }
});

test('only explicit ClamAV build inputs invalidate a complete cache', async () => {
  const fixture = await createAntiVirusFixture();

  try {
    await createValidCache(fixture.directory);
    await writeFile(
      join(fixture.directory, 'unrelated-application-change.ts'),
      'export const unrelated = true;\n',
    );

    await execFileAsync('bash', ['scripts/build.sh'], {
      cwd: fixture.directory,
      env: fixture.env,
    });
    await assert.rejects(access(fixture.dockerLog), { code: 'ENOENT' });

    const inputsPath = join(fixture.directory, 'build-inputs.env');
    const inputs = await readFile(inputsPath, 'utf8');
    await writeFile(
      inputsPath,
      inputs.replace("CLAMAV_VERSION='1.0.9'", "CLAMAV_VERSION='1.0.10'"),
    );

    await assert.rejects(
      execFileAsync('bash', ['scripts/build.sh'], {
        cwd: fixture.directory,
        env: fixture.env,
      }),
      { code: 97 },
    );
    assert.match(await readFile(fixture.dockerLog, 'utf8'), /^pull /);
    await assert.rejects(access(join(fixture.directory, 'bin')), {
      code: 'ENOENT',
    });
  } finally {
    await rm(fixture.directory, { recursive: true });
  }
});

test('invalid restored caches are removed before rebuilding', async (t) => {
  const scenarios = [
    {
      name: 'corrupt content',
      mutate: (directory) =>
        writeFile(join(directory, 'bin', 'libclamav.so'), 'corrupt\n'),
    },
    {
      name: 'incomplete content',
      mutate: (directory) => rm(join(directory, 'bin', 'libclamav.so')),
    },
    {
      name: 'invalid executable permissions',
      mutate: (directory) => chmod(join(directory, 'bin', 'clamscan'), 0o644),
    },
    {
      name: 'unrecorded content',
      mutate: (directory) =>
        writeFile(join(directory, 'bin', 'unexpected.so'), 'unexpected\n'),
    },
    {
      name: 'corrupt manifest',
      mutate: (directory) =>
        writeFile(join(directory, 'bin', '.build-manifest'), 'invalid\n'),
    },
  ];

  for (const scenario of scenarios) {
    await t.test(scenario.name, async () => {
      const fixture = await createAntiVirusFixture();

      try {
        await createValidCache(fixture.directory);
        await scenario.mutate(fixture.directory);

        await assert.rejects(
          execFileAsync('bash', ['scripts/build.sh'], {
            cwd: fixture.directory,
            env: fixture.env,
          }),
          { code: 97 },
        );
        assert.match(await readFile(fixture.dockerLog, 'utf8'), /^pull /);
        await assert.rejects(access(join(fixture.directory, 'bin')), {
          code: 'ENOENT',
        });
      } finally {
        await rm(fixture.directory, { recursive: true });
      }
    });
  }
});
