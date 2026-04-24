import { writeFile } from 'node:fs';
import tomlify from 'tomlify-j0.4';
import OutputsEnvPlugin, {
  IServerlessInstance,
  IServerlessOptions,
} from '../outputs-env-plugin';

type ITestInstance = Partial<IServerlessInstance>;

describe('OutputsEnvPlugin', () => {
  let options: IServerlessOptions & {
    region: string;
    stage: string;
  };
  let outputsEnvPlugin: OutputsEnvPlugin;
  let serverless: ITestInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    options = {
      region: 'eu-west-1',
      stage: 'test',
    };
    serverless = {
      cli: {
        log: jest.fn(),
      },
      getProvider: jest.fn().mockReturnValue({
        getRegion: jest.fn().mockReturnValue(options.region),
        getStage: jest.fn().mockReturnValue(options.stage),
        request: jest.fn(() => ({
          Stacks: [
            {
              Outputs: [
                {
                  OutputKey: 'CUSTOM_INPUT',
                  OutputValue: 'CUSTOM_INPUT',
                },
                {
                  OutputKey: 'STAGE',
                  OutputValue: options.stage,
                },
              ],
            },
          ],
        })),
      }),
      service: {
        custom: {
          outputs: {
            env: {
              AWS_REGION: 'ENV_AWS_REGION',
              CUSTOM_INPUT: 'ENV_CUSTOM_INPUT',
              MADE_UP: 'ENV_MADE_UP',
              STAGE: 'ENV_STAGE',
            },
            files: ['.env', '.env.production'],
          },
        },
        provider: {
          name: 'aws',
        },
      },
    };
  });

  describe('without a stack name defined', () => {
    it('should throw an error if service is not provided', async () => {
      delete serverless.service;

      outputsEnvPlugin = new OutputsEnvPlugin(
        serverless as IServerlessInstance,
        options,
      );

      await outputsEnvPlugin.hooks['after:deploy:deploy']();

      expect(serverless.cli.log).toHaveBeenCalledWith(
        'Cannot process Stack Output: Invalid serverless configuration!',
      );
    });

    it('should throw an error if no provider is set', async () => {
      delete serverless.service?.provider;

      outputsEnvPlugin = new OutputsEnvPlugin(
        serverless as IServerlessInstance,
        options,
      );

      await outputsEnvPlugin.hooks['after:deploy:deploy']();

      expect(serverless.cli.log).toHaveBeenCalledWith(
        'Cannot process Stack Output: Invalid serverless configuration!',
      );
    });

    it('should throw an error if provider is not AWS', async () => {
      const provider = serverless.service?.provider;

      if (!provider) {
        throw new Error('Expected provider');
      }

      provider.name = 'Azure';

      outputsEnvPlugin = new OutputsEnvPlugin(
        serverless as IServerlessInstance,
        options,
      );

      await outputsEnvPlugin.hooks['after:deploy:deploy']();

      expect(serverless.cli.log).toHaveBeenCalledWith(
        'Cannot process Stack Output: Only supported for AWS provider!',
      );
    });

    it('should display an error if skipping deployment', async () => {
      options.noDeploy = true;

      outputsEnvPlugin = new OutputsEnvPlugin(
        serverless as IServerlessInstance,
        options,
      );

      await outputsEnvPlugin.hooks['after:deploy:deploy']();

      expect(serverless.cli.log).toHaveBeenCalledWith(
        'Cannot process Stack Output: Skipping deployment with --noDeploy flag!',
      );
    });

    it('should output the correct data', async () => {
      outputsEnvPlugin = new OutputsEnvPlugin(
        serverless as IServerlessInstance,
        options,
      );

      await outputsEnvPlugin.hooks['after:deploy:deploy']();

      expect(tomlify.toToml).toHaveBeenCalledWith({
        ENV_AWS_REGION: 'eu-west-1',
        ENV_CUSTOM_INPUT: 'CUSTOM_INPUT',
        ENV_STAGE: 'test',
      });
    });

    it('should write the file the correct number of times', async () => {
      outputsEnvPlugin = new OutputsEnvPlugin(
        serverless as IServerlessInstance,
        options,
      );

      await outputsEnvPlugin.hooks['after:deploy:deploy']();

      expect(writeFile).toHaveBeenCalledTimes(2);
    });
  });

  describe('with a stack name defined', () => {
    beforeEach(() => {
      const provider = serverless.service?.provider;

      if (!provider) {
        throw new Error('Expected provider');
      }

      provider.stackName = 'custom-stack-name';
    });

    it('should throw an error if service is not provided', async () => {
      delete serverless.service;

      outputsEnvPlugin = new OutputsEnvPlugin(
        serverless as IServerlessInstance,
        options,
      );

      await outputsEnvPlugin.hooks['after:deploy:deploy']();

      expect(serverless.cli.log).toHaveBeenCalledWith(
        'Cannot process Stack Output: Invalid serverless configuration!',
      );
    });

    it('should throw an error if no provider is set', async () => {
      delete serverless.service?.provider;

      outputsEnvPlugin = new OutputsEnvPlugin(
        serverless as IServerlessInstance,
        options,
      );

      await outputsEnvPlugin.hooks['after:deploy:deploy']();

      expect(serverless.cli.log).toHaveBeenCalledWith(
        'Cannot process Stack Output: Invalid serverless configuration!',
      );
    });

    it('should throw an error if provider is not AWS', async () => {
      const provider = serverless.service?.provider;

      if (!provider) {
        throw new Error('Expected provider');
      }

      provider.name = 'Azure';

      outputsEnvPlugin = new OutputsEnvPlugin(
        serverless as IServerlessInstance,
        options,
      );

      await outputsEnvPlugin.hooks['after:deploy:deploy']();

      expect(serverless.cli.log).toHaveBeenCalledWith(
        'Cannot process Stack Output: Only supported for AWS provider!',
      );
    });

    it('should display an error if skipping deployment', async () => {
      options.noDeploy = true;

      outputsEnvPlugin = new OutputsEnvPlugin(
        serverless as IServerlessInstance,
        options,
      );

      await outputsEnvPlugin.hooks['after:deploy:deploy']();

      expect(serverless.cli.log).toHaveBeenCalledWith(
        'Cannot process Stack Output: Skipping deployment with --noDeploy flag!',
      );
    });

    it('should output the correct data', async () => {
      outputsEnvPlugin = new OutputsEnvPlugin(
        serverless as IServerlessInstance,
        options,
      );

      await outputsEnvPlugin.hooks['after:deploy:deploy']();

      expect(tomlify.toToml).toHaveBeenCalledWith({
        ENV_AWS_REGION: 'eu-west-1',
        ENV_CUSTOM_INPUT: 'CUSTOM_INPUT',
        ENV_STAGE: 'test',
      });
    });

    it('should write the file the correct number of times', async () => {
      outputsEnvPlugin = new OutputsEnvPlugin(
        serverless as IServerlessInstance,
        options,
      );

      await outputsEnvPlugin.hooks['after:deploy:deploy']();

      expect(writeFile).toHaveBeenCalledTimes(2);
    });
  });
});
