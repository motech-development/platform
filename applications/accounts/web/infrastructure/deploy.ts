import { execFileSync } from 'node:child_process';
import { branchForStage, hostedUrlForStage, parseStage } from './stage';

interface AmplifyJob {
  commitId?: string;
  jobId: string;
  status: string;
}

interface AmplifyJobStep {
  logUrl?: string;
}

const amplifyJobPollIntervalSeconds = '20';

function aws(arguments_: string[]) {
  return execFileSync('aws', arguments_, { encoding: 'utf8' });
}

function required(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required for Accounts web deployment`);
  }

  return value;
}

function streamBuildLogs(
  steps: readonly AmplifyJobStep[],
  streamedCharacters: Map<number, number>,
) {
  steps.forEach((step, index) => {
    if (!step.logUrl) {
      return;
    }

    let log: string;

    try {
      log = execFileSync(
        'curl',
        ['--silent', '--show-error', '--fail', '--location', step.logUrl],
        {
          encoding: 'utf8',
          maxBuffer: Number.POSITIVE_INFINITY,
        },
      );
    } catch {
      return;
    }

    const previousLength = streamedCharacters.get(index) ?? 0;
    const nextStart = log.length < previousLength ? 0 : previousLength;

    process.stderr.write(log.slice(nextStart));
    streamedCharacters.set(index, log.length);
  });
}

function waitForJob(
  appId: string,
  branchName: string,
  job: AmplifyJob,
): AmplifyJob {
  let current = job;
  const streamedCharacters = new Map<number, number>();

  while (
    ['CREATED', 'PENDING', 'PROVISIONING', 'RUNNING'].includes(current.status)
  ) {
    execFileSync('sleep', [amplifyJobPollIntervalSeconds]);
    const next = (
      JSON.parse(
        aws([
          'amplify',
          'get-job',
          '--app-id',
          appId,
          '--branch-name',
          branchName,
          '--job-id',
          current.jobId,
          '--output',
          'json',
        ]),
      ) as {
        job: {
          steps?: AmplifyJobStep[];
          summary: AmplifyJob;
        };
      }
    ).job;

    streamBuildLogs(next.steps ?? [], streamedCharacters);
    current = next.summary;
  }

  return current;
}

const stage = parseStage(process.argv.slice(2));
const branchName = branchForStage(stage);
const commitIndex = process.argv.indexOf('--commit');
const requestedCommit =
  commitIndex === -1 ? 'HEAD' : process.argv[commitIndex + 1];

if (!requestedCommit) {
  throw new Error('--commit requires a Git revision');
}

const commitId = execFileSync(
  'git',
  ['rev-parse', `${requestedCommit}^{commit}`],
  {
    encoding: 'utf8',
  },
).trim();
const appId = JSON.parse(
  aws([
    'cloudformation',
    'describe-stacks',
    '--stack-name',
    'accounts-web-hosting',
    '--query',
    "Stacks[0].Outputs[?OutputKey=='AmplifyAppId'].OutputValue | [0]",
    '--output',
    'json',
  ]),
) as string;
const publicBranchEnvironmentVariables = {
  VITE_APPSYNC_URL: required('VITE_APPSYNC_URL'),
  VITE_AUTH0_AUDIENCE: required('VITE_AUTH0_AUDIENCE'),
  VITE_AUTH0_CLIENT_ID: required('VITE_AUTH0_CLIENT_ID'),
  VITE_AUTH0_DOMAIN: required('VITE_AUTH0_DOMAIN'),
  VITE_AWS_REGION: required('VITE_AWS_REGION'),
  VITE_COMMIT_SHA: commitId,
  VITE_SENTRY_DSN: required('VITE_SENTRY_DSN'),
  VITE_STAGE: stage,
};

execFileSync(
  'git',
  ['push', 'origin', `${commitId}:refs/heads/${branchName}`, '--force'],
  { stdio: 'inherit' },
);

if (stage.startsWith('pr-')) {
  try {
    aws([
      'amplify',
      'get-branch',
      '--app-id',
      appId,
      '--branch-name',
      branchName,
    ]);
  } catch (error) {
    if (
      !(error instanceof Error) ||
      !error.message.includes('NotFoundException')
    ) {
      throw error;
    }

    aws([
      'amplify',
      'create-branch',
      '--app-id',
      appId,
      '--branch-name',
      branchName,
      '--no-enable-auto-build',
      '--no-enable-pull-request-preview',
      '--framework',
      'React',
      '--stage',
      'DEVELOPMENT',
    ]);
  }
}

// SENTRY_AUTH_TOKEN is app-level Amplify configuration inherited by every
// branch. Branch deployment owns only public application configuration and
// must never read, copy, or update the shared credential.
aws([
  'amplify',
  'update-branch',
  '--app-id',
  appId,
  '--branch-name',
  branchName,
  '--environment-variables',
  JSON.stringify(publicBranchEnvironmentVariables),
]);
const started = JSON.parse(
  aws([
    'amplify',
    'start-job',
    '--app-id',
    appId,
    '--branch-name',
    branchName,
    '--job-type',
    'RELEASE',
    '--commit-id',
    commitId,
    '--commit-message',
    `Deploy ${commitId}`,
    '--output',
    'json',
  ]),
) as { jobSummary: AmplifyJob };
const job = waitForJob(appId, branchName, started.jobSummary);

if (job.status !== 'SUCCEED' || job.commitId !== commitId) {
  throw new Error(
    `Amplify deployment ended ${job.status} at ${job.commitId ?? 'unknown'}, expected ${commitId}`,
  );
}

process.stdout.write(
  `${JSON.stringify({
    amplify: {
      appId,
      branchName,
      jobId: job.jobId,
    },
    commitId,
    url: hostedUrlForStage(stage, appId),
  })}\n`,
);
