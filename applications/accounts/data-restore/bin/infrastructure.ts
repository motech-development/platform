#!/usr/bin/env node

import { App } from 'aws-cdk-lib';
import { DataRestoreStack } from '../lib/data-restore-stack';

const app = new App();

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
    source: '',
    target: '',
  },
);
