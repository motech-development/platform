#!/usr/bin/env node

import { App } from 'aws-cdk-lib';
import { DataRestoreStack } from '../lib/data-restore-stack';

const app = new App();

const source = app.node.tryGetContext('source') as string | undefined;

const target = app.node.tryGetContext('target') as string | undefined;

if (!source || !target) {
  throw new Error(
    'Provide the table names with -c source=<table> -c target=<table>',
  );
}

new DataRestoreStack(
  app,
  'DataRestoreStack',
  {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },
  },
  {
    source,
    target,
  },
);
