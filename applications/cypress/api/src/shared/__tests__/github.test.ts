import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';
import { SSM } from 'aws-sdk';
import github from '../github';

describe('github', () => {
  let env: NodeJS.ProcessEnv;

  beforeEach(() => {
    env = {
      ...process.env,
    };

    process.env.CY_API_GITHUB_APP_ID = 'app-id';
    process.env.CY_API_GITHUB_CLIENT_ID = 'client-id';
    process.env.CY_API_GITHUB_INSTALLATION_ID = 'installation-id';
    process.env.GITHUB_APP_PRIVATE_KEY = 'SSM_Name';

    SSM.prototype.getParameter = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        Parameter: {
          Value: 'MY-SECRET-KEY',
        },
      }),
    });
  });

  afterEach(() => {
    process.env = env;
  });

  it('should retrieve the correct parameter from SSM', async () => {
    await github();

    expect(SSM.prototype.getParameter).toHaveBeenCalledWith({
      Name: 'SSM_Name',
    });
  });

  it('should throw an error if parameter cannot be retrieved', async () => {
    SSM.prototype.getParameter = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        Parameter: {},
      }),
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
