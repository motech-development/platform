import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

interface IServerlessConfiguration {
  functions: Record<string, unknown>;
  resources: {
    Resources: Record<string, unknown>;
  };
}

interface IIamRole {
  Properties: {
    Policies: Array<{
      PolicyDocument: {
        Statement: Array<{
          Action?: string[];
        }>;
      };
    }>;
  };
}

const printedConfiguration = execFileSync(
  'yarn',
  ['exec', 'serverless', 'print', '--format', 'json'],
  {
    cwd: resolve(__dirname, '../..'),
    encoding: 'utf8',
    env: {
      ...process.env,
      SENTRY_DSN: 'https://public@example.com/1',
    },
  },
);
const configuration = JSON.parse(
  printedConfiguration,
) as IServerlessConfiguration;

describe('Scheduled Transaction infrastructure', () => {
  it('configures bounded retry and separate failure destinations', () => {
    expect(configuration.functions).toMatchObject({
      PublishTransactions: {
        events: [
          {
            sqs: {
              arn: {
                'Fn::GetAtt': ['PublicationQueue', 'Arn'],
              },
              batchSize: 1,
            },
          },
        ],
        role: 'PublishTransactionsLambdaFunctionRole',
      },
      ReportSchedulingAlarm: {
        handler: 'src/report-scheduling-alarm.handler',
        role: 'SchedulingAlarmLambdaFunctionRole',
      },
      ScheduleTransactions: {
        role: 'ScheduleTransactionsLambdaFunctionRole',
      },
    });
    expect(configuration.resources.Resources).toMatchObject({
      PublicationDeadLetterQueue: {
        Type: 'AWS::SQS::Queue',
      },
      PublicationQueue: {
        Properties: {
          RedrivePolicy: {
            deadLetterTargetArn: {
              'Fn::GetAtt': ['PublicationDeadLetterQueue', 'Arn'],
            },
            maxReceiveCount: 5,
          },
        },
        Type: 'AWS::SQS::Queue',
      },
      ScheduleSynchronisationDeadLetterQueue: {
        Type: 'AWS::SQS::Queue',
      },
      ScheduleSynchronisationFailureBucket: {
        Properties: {
          LifecycleConfiguration: {
            Rules: [
              expect.objectContaining({
                ExpirationInDays: 14,
                Status: 'Enabled',
              }),
            ],
          },
          NotificationConfiguration: {
            EventBridgeConfiguration: {
              EventBridgeEnabled: true,
            },
          },
        },
        Type: 'AWS::S3::Bucket',
      },
      ScheduleSynchronisationFailureRule: {
        Properties: {
          Targets: [
            expect.objectContaining({
              Arn: {
                'Fn::GetAtt': ['ScheduleSynchronisationDeadLetterQueue', 'Arn'],
              },
            }),
          ],
        },
        Type: 'AWS::Events::Rule',
      },
      ScheduleTransactionsEventSourceMapping: {
        Properties: {
          BatchSize: 1,
          DestinationConfig: {
            OnFailure: {
              Destination: {
                'Fn::GetAtt': ['ScheduleSynchronisationFailureBucket', 'Arn'],
              },
            },
          },
          MaximumRetryAttempts: 4,
          StartingPosition: 'LATEST',
        },
        Type: 'AWS::Lambda::EventSourceMapping',
      },
      SchedulerDeliveryDeadLetterQueue: {
        Type: 'AWS::SQS::Queue',
      },
    });
  });

  it('owns the one-time Scheduler group and least-privilege roles', () => {
    expect(configuration.resources.Resources).toMatchObject({
      PublishTransactionsLambdaFunctionRole: {
        Type: 'AWS::IAM::Role',
      },
      ScheduleTransactionsLambdaFunctionRole: {
        Type: 'AWS::IAM::Role',
      },
      ScheduledTransactionScheduleGroup: {
        Properties: {
          Name: 'accounts-local-scheduled-transactions',
        },
        Type: 'AWS::Scheduler::ScheduleGroup',
      },
      SchedulerPublicationRole: {
        Properties: {
          AssumeRolePolicyDocument: {
            Statement: [
              expect.objectContaining({
                Principal: {
                  Service: ['scheduler.amazonaws.com'],
                },
              }),
            ],
          },
        },
        Type: 'AWS::IAM::Role',
      },
    });

    const publishTransactionsRole = configuration.resources.Resources
      .PublishTransactionsLambdaFunctionRole as IIamRole;

    expect(
      publishTransactionsRole.Properties.Policies[0].PolicyDocument.Statement[0]
        .Action,
    ).toEqual(['dynamodb:GetItem', 'dynamodb:PutItem', 'dynamodb:UpdateItem']);
  });

  it('alarms independently without consuming failed messages', () => {
    expect(configuration.resources.Resources).toMatchObject({
      PublicationDeadLetterQueueAlarm: {
        Type: 'AWS::CloudWatch::Alarm',
      },
      ScheduleSynchronisationDeadLetterQueueAlarm: {
        Type: 'AWS::CloudWatch::Alarm',
      },
      SchedulerDeliveryDeadLetterQueueAlarm: {
        Type: 'AWS::CloudWatch::Alarm',
      },
      SchedulingAlarmLambdaPermission: {
        Properties: {
          Principal: 'lambda.alarms.cloudwatch.amazonaws.com',
          SourceAccount: {
            Ref: 'AWS::AccountId',
          },
        },
        Type: 'AWS::Lambda::Permission',
      },
    });
  });

  it('keeps DynamoDB TTL for unrelated cleanup', () => {
    expect(configuration.resources.Resources).toMatchObject({
      ApplicationTable: {
        Properties: {
          TimeToLiveSpecification: {
            AttributeName: 'ttl',
            Enabled: true,
          },
        },
      },
    });
  });
});
