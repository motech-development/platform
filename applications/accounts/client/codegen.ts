import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  config: {
    scalars: {
      AWSDate: 'string',
      AWSDateTime: 'string',
      AWSEmail: 'string',
      AWSIPAddress: 'string',
      AWSJSON: 'string',
      AWSPhone: 'string',
      AWSTime: 'string',
      AWSTimestamp: 'number',
      AWSURL: 'string',
    },
  },
  documents: ['src/**/*.tsx'],
  generates: {
    './src/graphql/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
  schema: '../api/schema/*.graphql',
};

export default config;
