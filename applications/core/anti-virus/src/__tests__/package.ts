import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  chmod,
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const applicationDirectory = resolve(__dirname, '../..');

async function createBinaryDirectory(
  root: string,
  name: string,
  cacheMetadata = false,
) {
  const directory = join(root, name);
  await mkdir(directory);
  await Promise.all(
    (
      [
        ['clamscan', 'clamscan binary\n', 0o755],
        ['freshclam', 'freshclam binary\n', 0o755],
        ['libclamav.so', 'shared library\n', 0o644],
      ] as const
    ).map(async ([filename, contents, mode]) => {
      const path = join(directory, filename);
      await writeFile(path, contents);
      await chmod(path, mode);
    }),
  );
  if (cacheMetadata) {
    await writeFile(join(directory, '.build-manifest'), 'cache metadata\n');
    await writeFile(join(directory, '.build-revision'), 'cache revision\n');
  }
  return directory;
}

async function packageAntiVirus(
  binaryDirectory: string,
  outputDirectory: string,
) {
  const inspectionDirectory = join(dirname(binaryDirectory), 'handlers');
  await mkdir(inspectionDirectory, { recursive: true });
  await Promise.all(
    Array.from({ length: 6 }, (_, index) =>
      writeFile(
        join(inspectionDirectory, `handler-${index}.js`),
        'module.exports.handler = async () => ({ statusCode: 204 });\n',
      ),
    ),
  );
  await execFileAsync(
    'yarn',
    [
      'exec',
      'serverless',
      'package',
      '--stage',
      'package-test',
      '--package',
      outputDirectory,
    ],
    {
      cwd: applicationDirectory,
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

async function extractedManifest(archive: string, extractionDirectory: string) {
  await mkdir(extractionDirectory, { recursive: true });
  await execFileAsync('unzip', ['-qq', archive, '-d', extractionDirectory]);
  const manifest: Array<{ mode: number; path: string; sha256: string }> = [];

  async function visit(directory: string) {
    const entries = await readdir(directory, { withFileTypes: true });
    await Promise.all(
      entries.map(async (entry) => {
        const path = join(directory, entry.name);
        if (entry.isDirectory()) {
          await visit(path);
          return;
        }
        const [metadata, contents] = await Promise.all([
          stat(path),
          readFile(path),
        ]);
        manifest.push({
          mode: metadata.mode % 0o1000,
          path: relative(extractionDirectory, path),
          sha256: createHash('sha256').update(contents).digest('hex'),
        });
      }),
    );
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
    expect(freshArchives).toHaveLength(6);
    expect(cachedArchives).toEqual(freshArchives);

    const manifests = await Promise.all(
      freshArchives.map(async (archive) => {
        const [freshManifest, cachedManifest] = await Promise.all([
          extractedManifest(
            join(freshPackage, archive),
            join(temporaryDirectory, 'fresh-extracted', archive),
          ),
          extractedManifest(
            join(cachedPackage, archive),
            join(temporaryDirectory, 'cached-extracted', archive),
          ),
        ]);
        return { archive, cachedManifest, freshManifest };
      }),
    );

    manifests.forEach(({ archive, cachedManifest, freshManifest }) => {
      expect(cachedManifest).toEqual(freshManifest);

      const paths = freshManifest.map(({ path }) => path);
      expect(paths.some((path) => path.startsWith('.build-'))).toBe(false);
      const carriesClamAv = ['ScanFile.zip', 'UpdateDefinitions.zip'].includes(
        basename(archive),
      );
      const requiredPaths = [
        'clamscan',
        'freshclam',
        'freshclam.conf',
        'libclamav.so',
      ];
      expect(requiredPaths.map((path) => paths.includes(path))).toEqual(
        requiredPaths.map(() => carriesClamAv),
      );
      expect(
        ['clamscan', 'freshclam'].map(
          (executable) =>
            freshManifest.find(({ path }) => path === executable)?.mode,
        ),
      ).toEqual(carriesClamAv ? [0o755, 0o755] : [undefined, undefined]);
    });
  } finally {
    await rm(temporaryDirectory, { recursive: true });
  }
}, 120_000);
