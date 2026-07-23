import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const scriptPath = fileURLToPath(
  new URL('./empty-s3-bucket.sh', import.meta.url),
);

async function createAwsStub(t) {
  const directory = await mkdtemp(join(tmpdir(), 'empty-s3-bucket-'));
  const binDirectory = join(directory, 'bin');
  const callsPath = join(directory, 'aws-calls');
  await mkdir(binDirectory);
  await writeFile(
    join(binDirectory, 'aws'),
    `#!/usr/bin/env bash
printf '%s\n' "$*" >> "$AWS_CALLS"
`,
    { mode: 0o755 },
  );
  t.after(() => rm(directory, { recursive: true, force: true }));

  return {
    callsPath,
    env: {
      ...process.env,
      AWS_CALLS: callsPath,
      PATH: `${binDirectory}:${process.env.PATH}`,
    },
  };
}

test('malformed bucket arguments are rejected before calling AWS', async (t) => {
  const { callsPath, env } = await createAwsStub(t);

  for (const args of [
    [],
    [''],
    ['bucket-name'],
    ['https://bucket-name'],
    ['s3://bucket-name/path'],
    ['s3://bucket-name', 'unexpected'],
  ]) {
    await assert.rejects(execFileAsync(scriptPath, args, { env }), (error) => {
      assert.equal(error.code, 2);
      assert.match(
        error.stderr,
        /Usage: empty-s3-bucket\.sh s3:\/\/bucket-name/,
      );
      return true;
    });
  }

  await assert.rejects(access(callsPath), { code: 'ENOENT' });
});

test('a valid bucket URI is checked before its contents are removed', async (t) => {
  const { callsPath, env } = await createAwsStub(t);

  await execFileAsync(scriptPath, ['s3://bucket-name'], { env });

  assert.deepEqual((await readFile(callsPath, 'utf8')).trim().split('\n'), [
    's3api head-bucket --bucket bucket-name',
    's3 rm s3://bucket-name --recursive',
  ]);
});
