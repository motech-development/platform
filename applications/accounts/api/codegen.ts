import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  config: {
    defaultScalarType: 'unknown',
    enumsAsTypes: true,
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
  documents: ['src/**/*.ts', '!src/graphql/**'],
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
  generates: {
    './src/graphql/graphql.ts': {
      plugins: ['typescript', 'typescript-operations'],
    },
  },
  schema: './schema/*.graphql',
};

export default config;
