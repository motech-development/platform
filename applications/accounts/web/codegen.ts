import type { CodegenConfig } from '@graphql-codegen/cli';

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
  documents: ['src/**/*.{ts,tsx}', '!src/**/*.test.{ts,tsx}'],
  generates: {
    './src/graphql/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'graphql',
      },
    },
  },
  schema: ['../api/schema/*.graphql', 'src/data/client-schema.graphql'],
};

export default config;
