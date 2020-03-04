import assert from 'assert';
import { writeFile } from 'fs';
import Serverless from 'serverless';
import tomlify from 'tomlify-j0.4';
import { promisify } from 'util';

interface IOutput {
  [name: string]: string;
}

interface IConfig {
  files: string[];
  env: {
    [name: string]: string;
  };
}

const writeFileAsync = promisify(writeFile);

class OutputsEnvPlugin {
  private serverless: Serverless;

  private options: Serverless.Options;

  public get hooks() {
    return {
      'after:deploy:deploy': this.process.bind(this),
    };
  }

  private get output(): IConfig {
    return this.serverless.service.custom.outputs;
  }

  constructor(serverless: Serverless, options: Serverless.Options) {
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const { stackName } = this.serverless.service.provider;

    if (stackName) {
      return stackName;
    }

    return `${name}-${stage}`;
  }

  private async getOutput() {
    const { name } = this.serverless.service.provider;
    const region = this.serverless.getProvider(name).getRegion();
    const stage = this.serverless.getProvider(name).getStage();
    const { Stacks } = await this.serverless.getProvider(name).request(
      'CloudFormation',
      'describeStacks',
      {
        StackName: this.stackName(name, stage),
      },
      {
        region,
      },
    );

    const stack = Stacks.pop() || {
      Outputs: [],
    };
    const output = stack.Outputs || [];

    return output.reduce(
      (obj: object, item: IOutput) => ({
        ...obj,
        [item.OutputKey]: item.OutputValue,
      }),
      {
        AWS_REGION: region,
      },
    );
  }

  private async writeOutput(data: IOutput) {
    const output = Object.keys(data);
    const config = Object.keys(this.output.env);
    const result = config.reduce((obj, item) => {
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
    const queue = this.output.files.map(path => writeFileAsync(path, toml));

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
      this.serverless.cli.log(`Cannot process Stack Output: ${e.message}!`);
    }
  }
}

module.exports = OutputsEnvPlugin;
