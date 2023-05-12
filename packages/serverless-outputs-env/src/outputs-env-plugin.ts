import assert, { AssertionError } from 'assert';
import { writeFile } from 'node:fs';
import Serverless from 'serverless';
import tomlify from 'tomlify-j0.4';
import { promisify } from 'node:util';

interface IHook {
  [name: string]: () => Promise<void>;
}

interface IOutput {
  [name: string]: string;
}

interface IConfig {
  files: string[];
  env: {
    [name: string]: string;
  };
}

export interface IServerlessInstance
  extends Pick<Serverless, 'cli' | 'getProvider'> {
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

  private options: Serverless.Options;

  public get hooks(): IHook {
    return {
      'after:deploy:deploy': this.process.bind(this),
    };
  }

  private get output(): IConfig {
    return this.serverless.service.custom.outputs;
  }

  constructor(serverless: IServerlessInstance, options: Serverless.Options) {
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

  private async getOutput() {
    const { name } = this.serverless.service.provider;
    const region = this.serverless.getProvider(name).getRegion();
    const stage = this.serverless.getProvider(name).getStage();
    const { Stacks } = (await this.serverless.getProvider(name).request(
      'CloudFormation',
      'describeStacks',
      {
        StackName: this.stackName(name, stage),
      },
      {
        region,
      },
    )) as {
      Stacks: {
        Outputs: IOutput[];
      }[];
    };

    const stack = Stacks.pop();

    return stack?.Outputs.reduce(
      (obj, item) => ({
        ...obj,
        [item.OutputKey]: item.OutputValue,
      }),
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
