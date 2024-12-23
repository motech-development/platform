import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

interface IConfig {
  source: string;
  target: string;
}

export class DataRestoreStack extends Stack {
  private readonly source: string;

  private readonly target: string;

  constructor(
    scope: Construct,
    id: string,
    props: StackProps,
    config: IConfig,
  ) {
    super(scope, id, props);

    this.source = config.source;

    this.target = config.target;

    this.restore();
  }

  private getDatabases() {
    const sourceName = this.source;

    const source = Table.fromTableAttributes(this, sourceName, {
      tableName: sourceName,
    });

    const targetName = this.target;

    const target = Table.fromTableAttributes(this, targetName, {
      tableName: targetName,
    });

    return {
      source,
      target,
    };
  }

  private restore() {
    const { source, target } = this.getDatabases();

    const handler = new NodejsFunction(this, 'data-restore', {
      bundling: {
        minify: true,
      },
      entry: './src/data-restore.ts',
      environment: {
        LOG_LEVEL: 'debug',
        SOURCE: source.tableName,
        TARGET: target.tableName,
      },
      functionName: 'data-restore',
      runtime: Runtime.NODEJS_20_X,
      timeout: Duration.minutes(15),
    });

    source.grantReadData(handler);

    target.grantFullAccess(handler);
  }
}
