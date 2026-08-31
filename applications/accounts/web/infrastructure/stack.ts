import { CfnOutput, Stack, type StackProps, Tags } from 'aws-cdk-lib';
import { CfnApp, CfnBranch, CfnDomain } from 'aws-cdk-lib/aws-amplify';
import type { Construct } from 'constructs';

export class AccountsWebStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const app = new CfnApp(this, 'AccountsWebApp', {
      customRules: [
        {
          source:
            '</^[^.]+$|\\.(?!(bcmap|css|gif|ico|jpg|jpeg|js|mjs|pfb|png|txt|ttf|svg|wasm|woff|woff2|json|webmanifest)$)([^.]+$)/>',
          status: '200',
          target: '/_shell.html',
        },
      ],
      description:
        'Production-shaped React 19 walking skeleton for Motech Accounts',
      enableBranchAutoDeletion: true,
      environmentVariables: [
        {
          name: 'AMPLIFY_MONOREPO_APP_ROOT',
          value: 'applications/accounts/web',
        },
      ],
      name: 'accounts-web',
      platform: 'WEB',
      repository: 'https://github.com/motech-development/platform',
    });
    const develop = new CfnBranch(this, 'AccountsWebDevelopBranch', {
      appId: app.attrAppId,
      branchName: 'amplify/develop',
      description: 'Accounts Develop Environment',
      enableAutoBuild: false,
      enablePerformanceMode: false,
      enablePullRequestPreview: false,
      framework: 'React',
      stage: 'DEVELOPMENT',
    });
    const production = new CfnBranch(this, 'AccountsWebProductionBranch', {
      appId: app.attrAppId,
      branchName: 'amplify/production',
      description:
        'Isolated Accounts production candidate without legacy traffic',
      enableAutoBuild: false,
      enablePerformanceMode: false,
      enablePullRequestPreview: false,
      framework: 'React',
      stage: 'PRODUCTION',
    });
    const domain = new CfnDomain(this, 'AccountsWebDomain', {
      appId: app.attrAppId,
      domainName: 'motechdevelopment.co.uk',
      subDomainSettings: [
        {
          branchName: 'amplify/develop',
          prefix: 'accounts-develop',
        },
      ],
    });

    develop.addDependency(app);
    production.addDependency(app);
    domain.addDependency(develop);
    Tags.of(this).add('Application', 'accounts-web');

    [
      new CfnOutput(this, 'AmplifyAppId', {
        value: app.attrAppId,
      }),
      new CfnOutput(this, 'AmplifyDefaultDomain', {
        value: app.attrDefaultDomain,
      }),
    ].forEach((output) =>
      output.node.addMetadata('deployment-unit', 'accounts-web'),
    );
  }
}
