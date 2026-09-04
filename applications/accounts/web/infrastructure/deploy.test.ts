import {
  cleanupCommandFixtures,
  commitId,
  createCommandFixture,
  readCalls,
  runScript,
  scriptFailureMessage,
} from './hosting-command.fixture';

afterEach(cleanupCommandFixtures);

describe('Accounts web hosted deployment command', () => {
  it('deploys the requested commit without application configuration', async () => {
    const fixture = await createCommandFixture();

    const { stdout } = await runScript(
      'deploy.ts',
      ['--stage', 'develop', '--commit', commitId],
      fixture,
    );

    expect(JSON.parse(stdout)).toEqual({
      amplify: {
        appId: 'amplify-app-id',
        branchName: 'amplify/develop',
        jobId: 'job-1',
      },
      commitId,
      url: 'https://accounts-develop.motechdevelopment.co.uk',
    });
    expect(await readCalls(fixture.callsPath)).toEqual([
      ['git', 'rev-parse', `${commitId}^{commit}`],
      [
        'aws',
        'cloudformation',
        'describe-stacks',
        '--stack-name',
        'accounts-web-hosting',
        '--query',
        "Stacks[0].Outputs[?OutputKey=='AmplifyAppId'].OutputValue | [0]",
        '--output',
        'json',
      ],
      [
        'git',
        'push',
        'origin',
        `${commitId}:refs/heads/amplify/develop`,
        '--force',
      ],
      [
        'aws',
        'amplify',
        'update-branch',
        '--app-id',
        'amplify-app-id',
        '--branch-name',
        'amplify/develop',
        '--environment-variables',
        '{}',
      ],
      [
        'aws',
        'amplify',
        'start-job',
        '--app-id',
        'amplify-app-id',
        '--branch-name',
        'amplify/develop',
        '--job-type',
        'RELEASE',
        '--commit-id',
        commitId,
        '--commit-message',
        `Deploy ${commitId}`,
        '--output',
        'json',
      ],
    ]);
  });

  it('creates a missing Preview Environment branch before deployment', async () => {
    const fixture = await createCommandFixture('preview-missing');

    await runScript(
      'deploy.ts',
      ['--stage', 'pr-1542', '--commit', commitId],
      fixture,
    );

    const calls = await readCalls(fixture.callsPath);
    expect(
      calls.map(([command, service, operation]) => [
        command,
        service,
        operation,
      ]),
    ).toEqual([
      ['git', 'rev-parse', `${commitId}^{commit}`],
      ['aws', 'cloudformation', 'describe-stacks'],
      ['git', 'push', 'origin'],
      ['aws', 'amplify', 'get-branch'],
      ['aws', 'amplify', 'create-branch'],
      ['aws', 'amplify', 'update-branch'],
      ['aws', 'amplify', 'start-job'],
    ]);
  });

  it('leaves app-level Amplify credentials outside branch reconciliation', async () => {
    const fixture = await createCommandFixture();

    await runScript(
      'deploy.ts',
      ['--stage', 'develop', '--commit', commitId],
      fixture,
    );

    const calls = await readCalls(fixture.callsPath);
    const branchUpdate = calls.find(
      ([command, service, operation]) =>
        command === 'aws' &&
        service === 'amplify' &&
        operation === 'update-branch',
    );

    expect(branchUpdate).toBeDefined();
    expect(JSON.parse(branchUpdate?.at(-1) ?? '{}')).not.toHaveProperty(
      'SENTRY_AUTH_TOKEN',
    );
    expect(
      calls.some(
        ([command, service, operation]) =>
          command === 'aws' &&
          service === 'amplify' &&
          operation === 'update-app',
      ),
    ).toBe(false);
  });

  it('rejects an unsuccessful Amplify job', async () => {
    const fixture = await createCommandFixture('failed-job');

    expect(
      await scriptFailureMessage(
        runScript(
          'deploy.ts',
          ['--stage', 'develop', '--commit', commitId],
          fixture,
        ),
      ),
    ).toContain(
      `Amplify deployment ended FAILED at ${commitId}, expected ${commitId}`,
    );
  });

  it('waits for an active Amplify job to reach its terminal state', async () => {
    const fixture = await createCommandFixture('running-job');

    const { stderr, stdout } = await runScript(
      'deploy.ts',
      ['--stage', 'develop', '--commit', commitId],
      fixture,
    );

    const calls = await readCalls(fixture.callsPath);

    expect(JSON.parse(stdout)).toMatchObject({
      amplify: { jobId: 'job-1' },
    });
    expect(stderr).toBe('Build started\nBuild complete\n');
    expect(calls.filter(([command]) => command === 'sleep')).toEqual([
      ['sleep', '20'],
      ['sleep', '20'],
    ]);
    expect(
      calls.filter(
        ([command, service, operation]) =>
          command === 'aws' && service === 'amplify' && operation === 'get-job',
      ),
    ).toHaveLength(2);
    expect(calls.filter(([command]) => command === 'curl')).toHaveLength(2);
  });

  it('rejects an unexpected Preview Environment branch lookup error', async () => {
    const fixture = await createCommandFixture('preview-error');

    expect(
      await scriptFailureMessage(
        runScript(
          'deploy.ts',
          ['--stage', 'pr-1542', '--commit', commitId],
          fixture,
        ),
      ),
    ).toContain('AccessDeniedException: branch lookup denied');
  });
});
