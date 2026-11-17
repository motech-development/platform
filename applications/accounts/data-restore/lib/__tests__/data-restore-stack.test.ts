import { App } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { DataRestoreStack } from '../data-restore-stack';

const tableArn = (name: string) => ({
  'Fn::Join': [
    '',
    [
      'arn:',
      { Ref: 'AWS::Partition' },
      ':dynamodb:',
      { Ref: 'AWS::Region' },
      ':',
      { Ref: 'AWS::AccountId' },
      `:table/${name}`,
    ],
  ],
});

describe('DataRestoreStack', () => {
  let template: Template;

  beforeAll(() => {
    const stack = new DataRestoreStack(
      new App(),
      'TestStack',
      {},
      {
        source: 'source-table',
        target: 'target-table',
      },
    );

    template = Template.fromStack(stack);
  });

  it('should create the restore function with the table configuration', () => {
    template.resourceCountIs('AWS::Lambda::Function', 1);
    template.hasResourceProperties('AWS::Lambda::Function', {
      Environment: {
        Variables: {
          LOG_LEVEL: 'debug',
          SOURCE: 'source-table',
          TARGET: 'target-table',
        },
      },
      FunctionName: 'data-restore',
      Runtime: 'nodejs24.x',
      Timeout: 900,
    });
  });

  it('should grant read access to the source table and write access to the target table', () => {
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith(['dynamodb:Scan']),
            Effect: 'Allow',
            Resource: [tableArn('source-table')],
          }),
          Match.objectLike({
            Action: Match.arrayWith([
              'dynamodb:BatchWriteItem',
              'dynamodb:DeleteItem',
            ]),
            Effect: 'Allow',
            Resource: [tableArn('target-table')],
          }),
        ]),
      },
    });
  });

  it('should not grant write access to the source table', () => {
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.not(
          Match.arrayWith([
            Match.objectLike({
              Action: Match.arrayWith(['dynamodb:BatchWriteItem']),
              Resource: [tableArn('source-table')],
            }),
          ]),
        ),
      },
    });
  });

  it('should allow the function to pause stream consumers', () => {
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          {
            Action: [
              'cloudwatch:GetMetricData',
              'lambda:ListEventSourceMappings',
            ],
            Effect: 'Allow',
            Resource: '*',
          },
          {
            Action: [
              'lambda:GetEventSourceMapping',
              'lambda:UpdateEventSourceMapping',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':lambda:',
                  { Ref: 'AWS::Region' },
                  ':',
                  { Ref: 'AWS::AccountId' },
                  ':event-source-mapping:*',
                ],
              ],
            },
          },
        ]),
      },
    });
  });
});
