import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { promisify } from 'node:util';

import {
  synchronizeActionPins,
  updatedActionPins,
} from './sync-action-pins.mjs';

const execFileAsync = promisify(execFile);
const repositoryRoot = new URL('../../', import.meta.url);

async function readRepositoryFile(path) {
  return readFile(new URL(path, repositoryRoot), 'utf8');
}

test('Renovate exposes an immutable manually dispatched full dry run', async () => {
  const workflow = await readRepositoryFile('.github/workflows/renovate.yml');

  assert.match(workflow, /cron: '17 3,9,15,21 \* \* \*'/);
  assert.match(
    workflow,
    /workflow_dispatch:[\s\S]*cache-mode:[\s\S]*enabled[\s\S]*disabled[\s\S]*reset/,
  );
  assert.match(
    workflow,
    /workflow_dispatch:[\s\S]*dry-run:[\s\S]*type: boolean[\s\S]*default: true/,
  );
  assert.match(
    workflow,
    /concurrency:[\s\S]*group: renovate[\s\S]*cancel-in-progress: false/,
  );
  assert.match(workflow, /timeout-minutes: 120/);
  assert.match(workflow, /^permissions:\n  contents: read$/m);

  for (const permission of [
    'actions: read',
    'checks: read',
    'contents: write',
    'issues: write',
    'pull-requests: write',
    'statuses: read',
    'vulnerability-alerts: read',
    'workflows: write',
  ]) {
    assert.match(
      workflow,
      new RegExp(`permission-${permission.replace(': ', ': ')}`),
      permission,
    );
  }

  assert.match(
    workflow,
    /renovatebot\/github-action@[a-f0-9]{40} # v\d+\.\d+\.\d+/,
  );
  assert.match(workflow, /RENOVATE_VERSION: \d+\.\d+\.\d+@sha256:[a-f0-9]{64}/);
  assert.match(workflow, /renovate-version: \$\{\{ env\.RENOVATE_VERSION \}\}/);
  assert.match(workflow, /renovate-config-validator --strict renovate\.json/);
  assert.match(
    workflow,
    /RENOVATE_DRY_RUN: \$\{\{ github\.event_name == 'workflow_dispatch' && inputs\['dry-run'\] && 'full' \|\| '' \}\}/,
  );
});

test('Renovate restores only its repository cache and supports reset and disable modes', async () => {
  const workflow = await readRepositoryFile('.github/workflows/renovate.yml');

  assert.match(workflow, /path: \/tmp\/renovate\/cache\/renovate\/repository/);
  assert.match(
    workflow,
    /key: renovate-repository-\$\{\{ runner\.os \}\}-\$\{\{ github\.run_id \}\}-\$\{\{ github\.run_attempt \}\}/,
  );
  assert.match(
    workflow,
    /restore-keys: \|\n\s+renovate-repository-\$\{\{ runner\.os \}\}-/,
  );
  assert.match(workflow, /sudo chown -R 12021:0 \/tmp\/renovate/);
  assert.match(
    workflow,
    /inputs\['cache-mode'\] != 'disabled'[\s\S]*inputs\['cache-mode'\] != 'reset'/,
  );
  assert.match(
    workflow,
    /RENOVATE_REPOSITORY_CACHE: \$\{\{ github\.event_name == 'workflow_dispatch' && inputs\['cache-mode'\] \|\| 'enabled' \}\}/,
  );
});

test('supported managers reach the dry-run seam without a Node runtime manager', async () => {
  const [renovateConfig, packageJson] = await Promise.all([
    readRepositoryFile('renovate.json'),
    readRepositoryFile('package.json'),
  ]);
  const config = JSON.parse(renovateConfig);
  const rootManifest = JSON.parse(packageJson);

  assert.deepEqual(config.enabledManagers, [
    'npm',
    'github-actions',
    'custom.regex',
  ]);
  assert.doesNotMatch(renovateConfig, /node-version|nodenv|nvm/);
  assert.equal(rootManifest.devDependencies.renovate, undefined);
  assert.equal(rootManifest.resolutions['@semantic-release/error'], undefined);
});

test('GitHub Action upgrades reconcile delivery sources and generated workflows', async () => {
  const [workflow, renovateConfig] = await Promise.all([
    readRepositoryFile('.github/workflows/renovate.yml'),
    readRepositoryFile('renovate.json'),
  ]);
  const config = JSON.parse(renovateConfig);
  const actionRule = config.packageRules.find((rule) => rule.postUpgradeTasks);

  assert.deepEqual(actionRule.postUpgradeTasks, {
    commands: ['node .github/renovate/sync-action-pins.mjs'],
    fileFilters: ['.github/**'],
  });
  assert.match(
    workflow,
    /RENOVATE_ALLOWED_POST_UPGRADE_COMMANDS: '\["\^node \\\\.github\/renovate\/sync-action-pins\\\\.mjs\$"\]'/,
  );
});

test('Action pin reconciliation propagates Renovate changes to generated sources', () => {
  const updatedReference =
    'actions/checkout@aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa # v8.1.0';
  const pins = updatedActionPins(
    [
      '@@ -1 +1 @@',
      '-        uses: actions/checkout@bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb # v7.0.0',
      `+        uses: ${updatedReference}`,
    ].join('\n'),
  );
  const source =
    '        uses: actions/checkout@bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb # v7.0.0\n';

  assert.equal(
    synchronizeActionPins(source, pins),
    `        uses: ${updatedReference}\n`,
  );
});

test('Action pin reconciliation supports publisher replacements', () => {
  const pins = updatedActionPins(
    [
      '@@ -1 +1 @@',
      '-        uses: old-publisher/example@aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa # v1.2.3',
      '+        uses: new-publisher/example@bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb # v2.0.0',
    ].join('\n'),
  );
  const source =
    '        uses: old-publisher/example@aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa # v1.2.3\n';

  assert.equal(
    synchronizeActionPins(source, pins),
    '        uses: new-publisher/example@bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb # v2.0.0\n',
  );
});

test('Action pin reconciliation preserves a separate major stream', () => {
  const pins = updatedActionPins(
    [
      '@@ -1 +1 @@',
      '-        uses: actions/example@aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa # v2.1.0',
      '+        uses: actions/example@bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb # v2.2.0',
    ].join('\n'),
  );
  const source = [
    '        uses: actions/example@aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa # v2.1.0',
    '        uses: actions/example@cccccccccccccccccccccccccccccccccccccccc # v1.9.0',
    '',
  ].join('\n');

  assert.equal(
    synchronizeActionPins(source, pins),
    [
      '        uses: actions/example@bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb # v2.2.0',
      '        uses: actions/example@cccccccccccccccccccccccccccccccccccccccc # v1.9.0',
      '',
    ].join('\n'),
  );
});

test('external Actions are immutable and retain exact release comments', async () => {
  const { stdout } = await execFileAsync(
    'git',
    [
      'ls-files',
      '--cached',
      '--others',
      '--exclude-standard',
      '.github/**/*.yml',
      '.github/**/*.yaml',
      '.github/delivery/generate.mjs',
    ],
    { cwd: repositoryRoot },
  );
  const files = stdout.trim().split('\n').filter(Boolean);
  const mutableReferences = [];

  for (const file of files) {
    const content = await readRepositoryFile(file);

    for (const [index, line] of content.split('\n').entries()) {
      const match = line.match(
        /uses:\s+(?!\.\/)(?<action>[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)?)@(?<reference>[^\s#]+)/,
      );

      if (
        match &&
        (!/^[a-f0-9]{40}$/.test(match.groups.reference) ||
          !/# v\d+\.\d+\.\d+(?:\s|$)/.test(line))
      ) {
        mutableReferences.push(`${file}:${index + 1}: ${line.trim()}`);
      }
    }
  }

  assert.deepEqual(mutableReferences, []);
});
