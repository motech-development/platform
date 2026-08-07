import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const workspaceDirectory = process.cwd();
const infrastructureDirectory = join(workspaceDirectory, 'infrastructure');
const temporaryDirectories: string[] = [];

export const commitId = '1234567890abcdef1234567890abcdef12345678';
export const requiredEnvironment = {
  VITE_APPSYNC_URL: 'https://appsync.example.test/graphql',
  VITE_AUTH0_AUDIENCE: 'https://accounts.example.test',
  VITE_AUTH0_CLIENT_ID: 'auth0-client-id',
  VITE_AUTH0_DOMAIN: 'auth.example.test',
  VITE_AWS_REGION: 'eu-west-1',
  VITE_SENTRY_DSN: 'https://public@example.ingest.sentry.io/1',
};

export interface CommandFixture {
  callsPath: string;
  env: NodeJS.ProcessEnv;
}

const commandStub = `#!/usr/bin/env node
const { appendFileSync, readFileSync } = require('node:fs');
const { basename } = require('node:path');

const command = basename(process.argv[1]);
const arguments_ = process.argv.slice(2);
const scenario = process.env.COMMAND_SCENARIO || 'success';
appendFileSync(process.env.COMMAND_CALLS, JSON.stringify([command, ...arguments_]) + '\\n');

const calls = readFileSync(process.env.COMMAND_CALLS, 'utf8')
  .trim()
  .split('\\n')
  .map((line) => JSON.parse(line));

function fail(message) {
  process.stderr.write(message + '\\n');
  process.exit(1);
}

if (command === 'git') {
  if (arguments_[0] === 'rev-parse') {
    process.stdout.write(process.env.COMMIT_ID + '\\n');
  } else if (
    scenario === 'teardown-missing' &&
    arguments_.includes('--delete')
  ) {
    fail('error: unable to delete: remote ref does not exist');
  }
  process.exit(0);
}

if (command === 'sleep') {
  process.exit(0);
}

if (command === 'curl') {
  const curlCallCount = calls.filter(([called]) => called === 'curl').length;
  const log = curlCallCount === 1
    ? 'Build started\\n'
    : 'Build started\\nBuild complete\\n';

  process.stdout.write(log);
  process.exit(0);
}

if (arguments_[0] === 'cloudformation') {
  if (scenario === 'teardown-missing') {
    fail('Stack with id accounts-web-hosting does not exist');
  }
  process.stdout.write(JSON.stringify('amplify-app-id') + '\\n');
  process.exit(0);
}

const [, operation] = arguments_;

if (operation === 'get-branch') {
  if (scenario === 'preview-missing') {
    fail('NotFoundException: branch does not exist');
  }
  if (scenario === 'preview-error') {
    fail('AccessDeniedException: branch lookup denied');
  }
}

if (operation === 'delete-branch') {
  if (scenario === 'teardown-missing-branch') {
    fail('ResourceNotFoundException: branch does not exist');
  }
  if (scenario === 'teardown-error') {
    fail('AccessDeniedException: branch deletion denied');
  }
}

if (operation === 'start-job') {
  const status = scenario === 'failed-job'
    ? 'FAILED'
    : scenario === 'running-job'
      ? 'RUNNING'
      : 'SUCCEED';
  process.stdout.write(JSON.stringify({
    jobSummary: {
      commitId: process.env.COMMIT_ID,
      jobId: 'job-1',
      status,
    },
  }) + '\\n');
}

if (operation === 'get-job') {
  const getJobCallCount = calls.filter(
    ([called, service, calledOperation]) =>
      called === 'aws' &&
      service === 'amplify' &&
      calledOperation === 'get-job',
  ).length;
  process.stdout.write(JSON.stringify({
    job: {
      summary: {
        commitId: process.env.COMMIT_ID,
        jobId: 'job-1',
        status:
          scenario === 'running-job' && getJobCallCount === 1
            ? 'RUNNING'
            : 'SUCCEED',
      },
      steps: [{ logUrl: 'https://logs.example.test/build' }],
    },
  }) + '\\n');
}
`;

export async function createCommandFixture(
  scenario = 'success',
): Promise<CommandFixture> {
  const directory = await mkdtemp(join(tmpdir(), 'accounts-web-hosting-'));
  const binDirectory = join(directory, 'bin');
  const callsPath = join(directory, 'calls.jsonl');
  temporaryDirectories.push(directory);
  await mkdir(binDirectory);
  await Promise.all([
    writeFile(join(binDirectory, 'aws'), commandStub, { mode: 0o755 }),
    writeFile(join(binDirectory, 'curl'), commandStub, { mode: 0o755 }),
    writeFile(join(binDirectory, 'git'), commandStub, { mode: 0o755 }),
    writeFile(join(binDirectory, 'sleep'), commandStub, { mode: 0o755 }),
  ]);

  return {
    callsPath,
    env: {
      ...process.env,
      ...requiredEnvironment,
      COMMAND_CALLS: callsPath,
      COMMAND_SCENARIO: scenario,
      COMMIT_ID: commitId,
      PATH: `${binDirectory}:${process.env.PATH}`,
    },
  };
}

export function runScript(
  script: 'deploy.ts' | 'teardown.ts',
  arguments_: string[],
  fixture: CommandFixture,
  imports: string[] = [],
) {
  return execFileAsync(
    process.execPath,
    [
      '--import',
      'tsx',
      ...imports.flatMap((path) => ['--import', path]),
      join(infrastructureDirectory, script),
      ...arguments_,
    ],
    {
      cwd: workspaceDirectory,
      env: fixture.env,
    },
  );
}

export async function readCalls(callsPath: string) {
  return (await readFile(callsPath, 'utf8'))
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line) as string[]);
}

export async function scriptFailureMessage(
  execution: ReturnType<typeof runScript>,
) {
  try {
    await execution;
  } catch (error) {
    const { stderr } = error as { stderr?: unknown };

    if (typeof stderr === 'string') {
      return stderr;
    }

    throw error;
  }

  throw new Error('Expected script to fail');
}

export async function cleanupCommandFixtures() {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { force: true, recursive: true })),
  );
}
