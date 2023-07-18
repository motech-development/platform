import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import github from '../github';

describe('github', () => {
  let env: NodeJS.ProcessEnv;
  let ssm: AwsClientStub<SSMClient>;

  beforeEach(() => {
    env = {
      ...process.env,
    };

    process.env.CY_API_GITHUB_APP_ID = 'app-id';
    process.env.CY_API_GITHUB_CLIENT_ID = 'client-id';
    process.env.CY_API_GITHUB_INSTALLATION_ID = 'installation-id';
    process.env.GITHUB_APP_PRIVATE_KEY = 'SSM_Name';

    ssm = mockClient(SSMClient);

    ssm.on(GetParameterCommand).resolves({
      Parameter: {
        Value: 'MY-SECRET-KEY',
      },
    });
  });

  afterEach(() => {
    process.env = env;
  });

  it('should retrieve the correct parameter from SSM', async () => {
    await github();

    expect(ssm).toReceiveCommandWith(GetParameterCommand, {
      Name: 'SSM_Name',
    });
  });

  it('should throw an error if parameter cannot be retrieved', async () => {
    ssm.on(GetParameterCommand).resolvesOnce({
      Parameter: {},
    });

    await expect(github()).rejects.toThrow('Parameter not found');
  });

  it('should call createAppAuth with the correct params', async () => {
    await github();

    expect(createAppAuth).toHaveBeenCalledWith({
      appId: 'app-id',
      clientId: 'client-id',
      privateKey: 'MY-SECRET-KEY',
    });
  });

  it('should call auth with the correct params', async () => {
    const auth = createAppAuth({
      appId: 'app-id',
      clientId: 'client-id',
      privateKey: 'MY-SECRET-KEY',
    });

    await github();

    expect(auth).toHaveBeenCalledWith({
      installationId: 'installation-id',
      type: 'installation',
    });
  });

  it('should create Octokit instance with the correct params', async () => {
    await github();

    expect(Octokit).toHaveBeenCalledWith({
      auth: 'my-token',
    });
  });
});
