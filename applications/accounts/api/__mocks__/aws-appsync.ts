import * as AppSync from 'aws-appsync';

AppSync.AWSAppSyncClient.prototype.mutate = jest.fn();

module.exports = AppSync;
