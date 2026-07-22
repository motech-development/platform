import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  chmod,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join, relative } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));

async function createBinaryDirectory(root, name, cacheMetadata = false) {
  const directory = join(root, name);
  await mkdir(directory);
  for (const [filename, contents, mode] of [
    ['clamscan', 'clamscan binary\n', 0o755],
    ['freshclam', 'freshclam binary\n', 0o755],
    ['libclamav.so', 'shared library\n', 0o644],
  ]) {
    const path = join(directory, filename);
    await writeFile(path, contents);
    await chmod(path, mode);
  }
  if (cacheMetadata) {
    await writeFile(join(directory, '.build-manifest'), 'cache metadata\n');
    await writeFile(join(directory, '.build-revision'), 'cache revision\n');
  }
  return directory;
}

async function packageAntiVirus(binaryDirectory, outputDirectory) {
  const inspectionDirectory = join(dirname(binaryDirectory), 'handlers');
  await mkdir(inspectionDirectory, { recursive: true });
  for (let index = 0; index < 6; index += 1) {
    await writeFile(
      join(inspectionDirectory, `handler-${index}.js`),
      'module.exports.handler = async () => ({ statusCode: 204 });\n',
    );
  }
  await execFileAsync(
    'yarn',
    [
      'workspace',
      '@core/anti-virus',
      'exec',
      'serverless',
      'package',
      '--stage',
      'package-test',
      '--package',
      outputDirectory,
    ],
    {
      cwd: repositoryRoot,
      env: {
        ...process.env,
        ANTI_VIRUS_BINARY_DIRECTORY: binaryDirectory,
        ANTI_VIRUS_PACKAGE_INSPECTION_DIRECTORY: inspectionDirectory,
        SENTRY_DSN: 'https://public@example.invalid/1',
      },
      maxBuffer: 20 * 1024 * 1024,
      timeout: 120_000,
    },
  );
}

async function extractedManifest(archive, extractionDirectory) {
  await mkdir(extractionDirectory, { recursive: true });
  await execFileAsync('unzip', ['-qq', archive, '-d', extractionDirectory]);
  const manifest = [];

  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        await visit(path);
      } else {
        const metadata = await stat(path);
        const contents = await readFile(path);
        manifest.push({
          path: relative(extractionDirectory, path),
          mode: metadata.mode & 0o777,
          sha256: createHash('sha256').update(contents).digest('hex'),
        });
      }
    }
  }

  await visit(extractionDirectory);
  return manifest.sort((left, right) => left.path.localeCompare(right.path));
}

test('cached and uncached binaries produce equivalent deployable packages', async () => {
  const temporaryDirectory = await mkdtemp(
    join(tmpdir(), 'anti-virus-package-'),
  );

  try {
    const freshBinaries = await createBinaryDirectory(
      temporaryDirectory,
      'fresh-binaries',
    );
    const cachedBinaries = await createBinaryDirectory(
      temporaryDirectory,
      'cached-binaries',
      true,
    );
    const freshPackage = join(temporaryDirectory, 'fresh-package');
    const cachedPackage = join(temporaryDirectory, 'cached-package');

    await packageAntiVirus(freshBinaries, freshPackage);
    await packageAntiVirus(cachedBinaries, cachedPackage);

    const freshArchives = (await readdir(freshPackage))
      .filter((file) => file.endsWith('.zip'))
      .sort();
    const cachedArchives = (await readdir(cachedPackage))
      .filter((file) => file.endsWith('.zip'))
      .sort();
    assert.equal(freshArchives.length, 6);
    assert.deepEqual(cachedArchives, freshArchives);

    for (const archive of freshArchives) {
      const freshManifest = await extractedManifest(
        join(freshPackage, archive),
        join(temporaryDirectory, 'fresh-extracted', archive),
      );
      const cachedManifest = await extractedManifest(
        join(cachedPackage, archive),
        join(temporaryDirectory, 'cached-extracted', archive),
      );
      assert.deepEqual(cachedManifest, freshManifest, archive);

      const paths = freshManifest.map(({ path }) => path);
      assert.equal(
        paths.some((path) => path.startsWith('.build-')),
        false,
      );
      const carriesClamAv = ['ScanFile.zip', 'UpdateDefinitions.zip'].includes(
        basename(archive),
      );
      for (const required of [
        'clamscan',
        'freshclam',
        'freshclam.conf',
        'libclamav.so',
      ]) {
        assert.equal(
          paths.includes(required),
          carriesClamAv,
          `${archive}:${required}`,
        );
      }
      if (carriesClamAv) {
        for (const executable of ['clamscan', 'freshclam']) {
          const file = freshManifest.find(({ path }) => path === executable);
          assert.equal(file?.mode, 0o755, `${archive}:${executable}`);
        }
      }
    }
  } finally {
    await rm(temporaryDirectory, { recursive: true });
  }
});
