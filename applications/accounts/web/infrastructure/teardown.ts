import { spawnSync } from 'node:child_process';
import { branchForStage, parseStage } from './stage';

interface CommandOptions {
  ignore?: readonly RegExp[];
}

function run(
  command: string,
  arguments_: readonly string[],
  { ignore = [] }: CommandOptions = {},
) {
  const result = spawnSync(command, arguments_, {
    encoding: 'utf8',
    stdio: ['inherit', 'pipe', 'pipe'],
  });
  const output = `${result.stdout}${result.stderr}`;

  if (result.status === 0) {
    process.stdout.write(result.stdout);
    process.stderr.write(result.stderr);
    return result.stdout;
  }

  if (ignore.some((pattern) => pattern.test(output))) {
    process.stdout.write(
      `Already absent: ${command} ${arguments_.join(' ')}\n`,
    );
    return undefined;
  }

  throw new Error(
    output.trim() ||
      `${command} ${arguments_.join(' ')} exited ${result.status ?? 'without a status'}`,
  );
}

const stage = parseStage(process.argv.slice(2));

if (!stage.startsWith('pr-')) {
  throw new Error(
    'Only Preview Environment Accounts web branches may be torn down',
  );
}

const branchName = branchForStage(stage);
const appIdOutput = run(
  'aws',
  [
    'cloudformation',
    'describe-stacks',
    '--stack-name',
    'accounts-web-hosting',
    '--query',
    "Stacks[0].Outputs[?OutputKey=='AmplifyAppId'].OutputValue | [0]",
    '--output',
    'json',
  ],
  { ignore: [/does not exist/i] },
);

if (appIdOutput) {
  const appId = JSON.parse(appIdOutput) as string;

  run(
    'aws',
    [
      'amplify',
      'delete-branch',
      '--app-id',
      appId,
      '--branch-name',
      branchName,
    ],
    { ignore: [/not found/i, /ResourceNotFoundException/i] },
  );
}

run('git', ['push', 'origin', '--delete', branchName], {
  ignore: [/remote ref does not exist/i],
});
