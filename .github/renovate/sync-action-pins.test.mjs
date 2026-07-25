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

test('Action pin reconciliation pairs multiple updates by action identity', () => {
  const pins = updatedActionPins(
    [
      '@@ -1,2 +1,2 @@',
      '-        uses: actions/checkout@aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa # v7.0.0',
      '-        uses: actions/cache@bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb # v6.1.0',
      '+        uses: actions/cache@cccccccccccccccccccccccccccccccccccccccc # v6.2.0',
      '+        uses: actions/checkout@dddddddddddddddddddddddddddddddddddddddd # v7.1.0',
    ].join('\n'),
  );

  assert.equal(
    pins.get(
      'actions/checkout@aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa # v7.0.0',
    ),
    'actions/checkout@dddddddddddddddddddddddddddddddddddddddd # v7.1.0',
  );
  assert.equal(
    pins.get('actions/cache@bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb # v6.1.0'),
    'actions/cache@cccccccccccccccccccccccccccccccccccccccc # v6.2.0',
  );
});

test('Action pin reconciliation rejects ambiguous replacements', () => {
  const diff = [
    '@@ -1,2 +1,2 @@',
    '-        uses: old/first@aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa # v1.0.0',
    '-        uses: old/second@bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb # v1.0.0',
    '+        uses: new/first@cccccccccccccccccccccccccccccccccccccccc # v1.0.0',
    '+        uses: new/second@dddddddddddddddddddddddddddddddddddddddd # v1.0.0',
  ].join('\n');

  assert.throws(
    () => updatedActionPins(diff),
    /cannot pair changed GitHub Action references/,
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
    const content = await readFile(new URL(file, repositoryRoot), 'utf8');

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
