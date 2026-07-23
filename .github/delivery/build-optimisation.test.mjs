import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../..',
);

const lambdaServices = [
  ['@accounts/api', 'accounts/api'],
  ['@accounts/queue', 'accounts/queue'],
  ['@accounts/notifications', 'accounts/notifications'],
  ['@accounts/reports', 'accounts/reports'],
  ['@accounts/storage', 'accounts/storage'],
  ['@accounts/data', 'accounts/data'],
];

const readServiceFiles = async (workspacePath) => {
  const servicePath = resolve(repositoryRoot, 'applications', workspacePath);

  return {
    configuration: await readFile(
      resolve(servicePath, 'serverless.yml'),
      'utf8',
    ),
    manifest: JSON.parse(
      await readFile(resolve(servicePath, 'package.json'), 'utf8'),
    ),
  };
};

test('ordinary Node Lambda services record esbuild as their validated packaging path', async (t) => {
  for (const [workspace, workspacePath] of lambdaServices) {
    await t.test(workspace, async () => {
      const { configuration, manifest } = await readServiceFiles(workspacePath);

      assert.match(configuration, /package:\n  individually: true/);
      assert.match(configuration, /  - serverless-esbuild/);
      assert.doesNotMatch(configuration, /  - serverless-webpack/);
      assert.match(
        configuration,
        /  esbuild:\n    bundle: true[\s\S]*    platform: node[\s\S]*    sourcemap: true[\s\S]*    target: node24/,
      );
      assert.match(configuration, /functions:[\s\S]*\n    handler: /);

      assert.ok(manifest.devDependencies.esbuild);
      assert.ok(manifest.devDependencies['serverless-esbuild']);
      assert.equal(manifest.devDependencies['serverless-webpack'], undefined);
      assert.equal(
        manifest.devDependencies['fork-ts-checker-webpack-plugin'],
        undefined,
      );
    });
  }
});

test('core communications keeps Webpack without deployment type-checking', async () => {
  const { configuration, manifest } = await readServiceFiles('core/comms');

  assert.match(configuration, /package:\n  individually: true/);
  assert.match(configuration, /  - serverless-webpack/);
  assert.doesNotMatch(configuration, /  - serverless-esbuild/);
  assert.equal(
    manifest.devDependencies['fork-ts-checker-webpack-plugin'],
    undefined,
  );
});
