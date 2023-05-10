import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';
import env from './env';

const ssm = new SSMClient({});

const github = async (): Promise<Octokit> => {
  const Name = env('GITHUB_APP_PRIVATE_KEY');
  const appId = env('CY_API_GITHUB_APP_ID');
  const clientId = env('CY_API_GITHUB_CLIENT_ID');
  const installationId = env('CY_API_GITHUB_INSTALLATION_ID');
  const command = new GetParameterCommand({
    Name,
  });
  const { Parameter } = await ssm.send(command);

  if (!Parameter?.Value) {
    throw new Error('Parameter not found');
  }

  const privateKey = Parameter.Value;
  const auth = createAppAuth({
    appId,
    clientId,
    privateKey,
  });
  const { token } = await auth({
    installationId,
    type: 'installation',
  });

  return new Octokit({
    auth: token,
  });
};

export default github;
