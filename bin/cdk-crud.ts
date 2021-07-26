#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkCrudStack } from '../lib/cdk-crud-stack';

const app = new cdk.App();
new CdkCrudStack(app, 'CdkCrudStack', {
  env: { account: '833915806704', region: 'eu-central-1' },
});
