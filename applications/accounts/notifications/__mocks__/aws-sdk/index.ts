import * as AWS from 'aws-sdk';

AWS.config.credentials = {
  accessKeyId: 'access-key-id',
  secretAccessKey: 'secret-access-key',
};

module.exports = AWS;
