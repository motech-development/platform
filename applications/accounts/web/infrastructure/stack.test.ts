import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { AccountsWebStack } from './stack';

describe('Accounts web hosting stack', () => {
  const template = Template.fromStack(
    new AccountsWebStack(new App(), 'accounts-web-hosting', {
      env: { account: '123456789012', region: 'eu-west-1' },
    }),
  );
  const synthesized = template.toJSON() as {
    Resources: Record<
      string,
      { Properties?: Record<string, unknown>; Type: string }
    >;
  };
  const resources = Object.values(synthesized.Resources);
  const amplifyApp = resources.find(({ Type }) => Type === 'AWS::Amplify::App');

  it('uses the existing GitHub App connection without embedded build configuration', () => {
    expect(amplifyApp?.Properties).toMatchObject({
      EnvironmentVariables: [
        {
          Name: 'AMPLIFY_MONOREPO_APP_ROOT',
          Value: 'applications/accounts/web',
        },
      ],
      Repository: 'https://github.com/motech-development/platform',
    });
    expect(amplifyApp?.Properties).not.toHaveProperty('AccessToken');
    expect(amplifyApp?.Properties).not.toHaveProperty('BuildSpec');
    expect(amplifyApp?.Properties).not.toHaveProperty('CustomHeaders');
    expect(amplifyApp?.Properties).not.toHaveProperty('IAMServiceRole');
    expect(resources.map(({ Type }) => Type)).not.toContain('AWS::IAM::Role');
    expect(resources.map(({ Type }) => Type)).not.toContain(
      'AWS::SecretsManager::Secret',
    );
  });

  it('serves PDF support files as static assets', () => {
    expect(amplifyApp?.Properties?.CustomRules).toContainEqual(
      expect.objectContaining({
        Source:
          '</^[^.]+$|\\.(?!(bcmap|css|gif|ico|jpg|jpeg|js|mjs|pfb|png|txt|ttf|svg|woff|woff2|json|webmanifest)$)([^.]+$)/>',
      }),
    );
  });
});
