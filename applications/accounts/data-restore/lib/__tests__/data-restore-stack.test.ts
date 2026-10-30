import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { DataRestoreStack } from '../data-restore-stack';

describe('DataRestoreStack', () => {
  let app: App;

  beforeEach(() => {
    app = new App();
  });

  it('should synthesize as expected', () => {
    const stack = new DataRestoreStack(
      app,
      'TestStack',
      {},
      {
        source: 'source-table',
        target: 'target-table',
      },
    );

    const template = Template.fromStack(stack);
    const synthesized = template.toJSON() as {
      Resources: Record<
        string,
        {
          Properties?: {
            Code?: {
              S3Key?: string;
            };
          };
          Type: string;
        }
      >;
    };
    const lambdaFunction = Object.values(synthesized.Resources).find(
      ({ Type }) => Type === 'AWS::Lambda::Function',
    );

    if (!lambdaFunction?.Properties?.Code?.S3Key) {
      throw new Error('Expected the Lambda bundle asset key to be synthesized');
    }

    expect(lambdaFunction.Properties.Code.S3Key).toMatch(
      /^[a-f0-9]{64}\.zip$/,
    );
    lambdaFunction.Properties.Code.S3Key = '<bundled-asset-hash>.zip';

    expect(synthesized).toMatchSnapshot();
  });
});
