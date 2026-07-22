import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import {
  mkdir,
  mkdtemp,
  readdir,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../..',
);

test('serverless-esbuild produces an isolated runnable archive for every handler', async () => {
  const fixturePath = await mkdtemp(join(tmpdir(), 'lambda-packaging-'));
  const artifactPath = resolve(fixturePath, 'artifacts');
  const handlerNames = ['alpha', 'beta'];
  const sourcePath = resolve(fixturePath, 'src');

  try {
    await mkdir(resolve(fixturePath, 'node_modules'));
    await mkdir(sourcePath);
    await symlink(
      resolve(
        repositoryRoot,
        'applications/accounts/api/node_modules/serverless-esbuild',
      ),
      resolve(fixturePath, 'node_modules/serverless-esbuild'),
      'dir',
    );
    await writeFile(
      resolve(fixturePath, 'package.json'),
      JSON.stringify({ name: 'lambda-packaging-fixture', private: true }),
    );
    await writeFile(
      resolve(fixturePath, 'serverless.yml'),
      `service: lambda-packaging-fixture
provider:
  name: aws
  runtime: nodejs24.x
package:
  individually: true
plugins:
  - serverless-esbuild
custom:
  esbuild:
    bundle: true
    platform: node
    sourcemap: true
    target: node24
functions:
  Alpha:
    handler: src/alpha.handler
  Beta:
    handler: src/beta.handler
`,
    );

    for (const handlerName of handlerNames) {
      await writeFile(
        resolve(sourcePath, `${handlerName}.ts`),
        `export const handler = async () => '${handlerName}';\n`,
      );
    }

    await execFileAsync(
      resolve(repositoryRoot, 'node_modules/.bin/serverless'),
      ['package', '--package', artifactPath],
      { cwd: fixturePath },
    );

    const archives = (await readdir(artifactPath))
      .filter((file) => file.endsWith('.zip'))
      .map((file) => resolve(artifactPath, file));

    assert.equal(archives.length, 2);

    for (const handlerName of handlerNames) {
      const archive = archives.find((file) =>
        basename(file).toLowerCase().includes(handlerName),
      );
      const otherHandlerName = handlerName === 'alpha' ? 'beta' : 'alpha';
      const extractedPath = resolve(fixturePath, `extracted-${handlerName}`);

      assert.ok(archive, `missing ${handlerName} handler archive`);

      const { stdout: contents } = await execFileAsync('unzip', [
        '-Z1',
        archive,
      ]);

      assert.match(contents, new RegExp(`src/${handlerName}\\.js\\n`));
      assert.match(contents, new RegExp(`src/${handlerName}\\.js\\.map\\n`));
      assert.doesNotMatch(contents, new RegExp(`src/${otherHandlerName}\\.js`));

      await mkdir(extractedPath);
      await execFileAsync('unzip', ['-qq', archive, '-d', extractedPath]);

      const packagedModule = await import(
        pathToFileURL(resolve(extractedPath, `src/${handlerName}.js`))
      );

      assert.equal(typeof packagedModule.handler, 'function');
      assert.equal(await packagedModule.handler(), handlerName);
    }
  } finally {
    await rm(fixturePath, { force: true, recursive: true });
  }
});

test('frontend quality plugins run for development but not production delivery builds', async () => {
  const clientPath = resolve(repositoryRoot, 'applications/accounts/client');
  const configPath = resolve(clientPath, 'vite.config.mts');
  const { loadConfigFromFile } = await import(
    pathToFileURL(resolve(clientPath, 'node_modules/vite/dist/node/index.js'))
  );
  const pluginNames = async (command, mode) => {
    const loaded = await loadConfigFromFile(
      { command, mode },
      configPath,
      undefined,
      'silent',
    );

    return loaded.config.plugins.flat().map((plugin) => plugin?.name);
  };

  const developmentPlugins = await pluginNames('serve', 'development');
  const developmentBuildPlugins = await pluginNames('build', 'development');
  const productionPlugins = await pluginNames('build', 'production');

  assert.ok(developmentPlugins.includes('vite-plugin-eslint'));
  assert.ok(developmentPlugins.includes('vite-plugin-checker'));
  assert.ok(developmentBuildPlugins.includes('vite-plugin-eslint'));
  assert.ok(developmentBuildPlugins.includes('vite-plugin-checker'));
  assert.ok(!productionPlugins.includes('vite-plugin-eslint'));
  assert.ok(!productionPlugins.includes('vite-plugin-checker'));
});
