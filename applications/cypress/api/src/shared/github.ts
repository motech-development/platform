import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';
import { SSM } from 'aws-sdk';
import env from './env';

const ssm = new SSM();

const github = async () => {
  const Name = env('GITHUB_APP_PRIVATE_KEY');
  const appId = env('CY_API_GITHUB_APP_ID');
  const clientId = env('CY_API_GITHUB_CLIENT_ID');
  const installationId = env('CY_API_GITHUB_INSTALLATION_ID');
  const { Parameter } = await ssm
    .getParameter({
      Name,
    })
    .promise();

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
