import { App } from 'aws-cdk-lib';
import { AccountsWebStack } from './stack';

const app = new App();
const environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'eu-west-1',
};

const hosting = new AccountsWebStack(app, 'accounts-web-hosting', {
  env: environment,
});

hosting.node.addMetadata('deployment-unit', 'accounts-web');
