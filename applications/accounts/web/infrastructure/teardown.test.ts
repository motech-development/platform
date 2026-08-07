import {
  cleanupCommandFixtures,
  createCommandFixture,
  readCalls,
  runScript,
  scriptFailureMessage,
} from './hosting-command.fixture';

afterEach(cleanupCommandFixtures);

describe('Accounts web hosted teardown command', () => {
  it('deletes the Amplify branch before its Git ref', async () => {
    const fixture = await createCommandFixture();

    await runScript('teardown.ts', ['--stage', 'pr-1542'], fixture);

    expect(await readCalls(fixture.callsPath)).toEqual([
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
        'aws',
        'amplify',
        'delete-branch',
        '--app-id',
        'amplify-app-id',
        '--branch-name',
        'amplify/pr-1542',
      ],
      ['git', 'push', 'origin', '--delete', 'amplify/pr-1542'],
    ]);
  });

  it('succeeds when the hosting stack and Git ref are already absent', async () => {
    const fixture = await createCommandFixture('teardown-missing');

    const { stdout } = await runScript(
      'teardown.ts',
      ['--stage', 'pr-1542'],
      fixture,
    );

    expect(stdout).toContain('Already absent: aws cloudformation');
    expect(stdout).toContain(
      'Already absent: git push origin --delete amplify/pr-1542',
    );
    expect(await readCalls(fixture.callsPath)).toHaveLength(2);
  });

  it('succeeds when only the Amplify branch is already absent', async () => {
    const fixture = await createCommandFixture('teardown-missing-branch');

    const { stdout } = await runScript(
      'teardown.ts',
      ['--stage', 'pr-1542'],
      fixture,
    );

    expect(stdout).toContain('Already absent: aws amplify delete-branch');
    expect(await readCalls(fixture.callsPath)).toHaveLength(3);
  });

  it('rejects an unexpected Amplify branch deletion error', async () => {
    const fixture = await createCommandFixture('teardown-error');

    expect(
      await scriptFailureMessage(
        runScript('teardown.ts', ['--stage', 'pr-1542'], fixture),
      ),
    ).toContain('AccessDeniedException: branch deletion denied');
    expect(await readCalls(fixture.callsPath)).toHaveLength(2);
  });
});
