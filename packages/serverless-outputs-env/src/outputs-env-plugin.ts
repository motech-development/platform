import { writeFile } from 'node:fs';
import { promisify } from 'node:util';
import assert, { AssertionError } from 'assert';
import tomlify from 'tomlify-j0.4';

interface IHook {
  [name: string]: () => Promise<void>;
}

interface IOutput {
  [name: string]: string;
}

interface IStackOutput {
  OutputKey?: string;
  OutputValue?: string;
}

interface IDescribeStacksResponse {
  Stacks?: {
    Outputs?: IStackOutput[];
  }[];
}

interface IConfig {
  files: string[];
  env: {
    [name: string]: string;
  };
}

export interface IServerlessCli {
  log(message: string): void;
}

export interface IServerlessOptions {
  noDeploy?: boolean;
}

interface IAwsProvider {
  getRegion(): string;
  getStage(): string;
  request(
    service: 'CloudFormation',
    method: 'describeStacks',
    params: {
      StackName: string;
    },
    options: {
      region: string;
    },
  ): Promise<IDescribeStacksResponse>;
}

export interface IServerlessInstance {
  cli: IServerlessCli;
  getProvider(name: string): IAwsProvider;
  service: {
    custom: {
      outputs: IConfig;
    };
    provider: {
      name: string;
      stackName?: string;
    };
  };
}

const writeFileAsync = promisify(writeFile);

class OutputsEnvPlugin {
  private serverless: IServerlessInstance;

  private options: IServerlessOptions;

  public get hooks(): IHook {
    return {
      'after:deploy:deploy': this.process.bind(this),
    };
  }

  private get output(): IConfig {
    return this.serverless.service.custom.outputs;
  }

  constructor(serverless: IServerlessInstance, options: IServerlessOptions) {
    this.serverless = serverless;
    this.options = options;
  }

  private validateConfig() {
    assert(this.serverless.service, 'Invalid serverless configuration');

    const { provider } = this.serverless.service;

    assert(provider, 'Invalid serverless configuration');

    assert(provider.name, 'Invalid serverless configuration');

    assert(provider.name === 'aws', 'Only supported for AWS provider');

    assert(
      this.options && !this.options.noDeploy,
      'Skipping deployment with --noDeploy flag',
    );
  }

  private stackName(name: string, stage: string) {
    const { stackName } = this.serverless.service.provider;

    if (stackName) {
      return stackName;
    }

    return `${name}-${stage}`;
  }

  private async getOutput(): Promise<IOutput | undefined> {
    const { name } = this.serverless.service.provider;
    const provider = this.serverless.getProvider(name);
    const region = provider.getRegion();
    const stage = provider.getStage();
    const response = await provider.request(
      'CloudFormation',
      'describeStacks',
      {
        StackName: this.stackName(name, stage),
      },
      {
        region,
      },
    );

    const stacks = response.Stacks ?? [];
    const stack = stacks[stacks.length - 1];
    const outputs = stack?.Outputs ?? [];

    return outputs.reduce<IOutput>(
      (obj, item) => {
        if (!item.OutputKey || !item.OutputValue) {
          return obj;
        }

        return {
          ...obj,
          [item.OutputKey]: item.OutputValue,
        };
      },
      {
        AWS_REGION: region,
      },
    );
  }

  private async writeOutput(data?: IOutput) {
    if (!data) {
      throw new Error('No output found.');
    }

    const output = Object.keys(data);
    const config = Object.keys(this.output.env);
    const result = config.reduce<IOutput>((obj, item) => {
      if (output.includes(item)) {
        return {
          ...obj,
          [this.output.env[item]]: data[item],
        };
      }

      return {
        ...obj,
      };
    }, {});
    const toml = tomlify.toToml(result);
    const queue = this.output.files.map((path) => writeFileAsync(path, toml));

    await Promise.all(queue);

    this.serverless.cli.log(
      '.env file has been written in requested locations',
    );
  }

  private async process() {
    try {
      this.validateConfig();

      const output = await this.getOutput();

      await this.writeOutput(output);
    } catch (e) {
      if (e instanceof AssertionError) {
        this.serverless.cli.log(`Cannot process Stack Output: ${e.message}!`);
      } else {
        this.serverless.cli.log('Unknown error encountered.');
      }
    }
  }
}

export default OutputsEnvPlugin;
