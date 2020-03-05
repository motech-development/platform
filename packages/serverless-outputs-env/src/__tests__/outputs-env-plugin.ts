import { writeFile } from 'fs';
import { Options } from 'serverless';
import tomlify from 'tomlify-j0.4';
import OutputsEnvPlugin, { IServerlessInstance } from '../outputs-env-plugin';

describe('OutputsEnvPlugin', () => {
  let options: Options;
  let outputsEnvPlugin: OutputsEnvPlugin;
  let serverless: IServerlessInstance;

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

      outputsEnvPlugin = new OutputsEnvPlugin(serverless, options);

      await outputsEnvPlugin.hooks['after:deploy:deploy']();

      expect(serverless.cli.log).toHaveBeenCalledWith(
        'Cannot process Stack Output: Invalid serverless configuration!',
      );
    });

    it('should throw an error if no provider is set', async () => {
      delete serverless.service.provider;

      outputsEnvPlugin = new OutputsEnvPlugin(serverless, options);

      await outputsEnvPlugin.hooks['after:deploy:deploy']();

      expect(serverless.cli.log).toHaveBeenCalledWith(
        'Cannot process Stack Output: Invalid serverless configuration!',
      );
    });

    it('should throw an error if provider is not AWS', async () => {
      serverless.service.provider.name = 'Azure';

      outputsEnvPlugin = new OutputsEnvPlugin(serverless, options);

      await outputsEnvPlugin.hooks['after:deploy:deploy']();

      expect(serverless.cli.log).toHaveBeenCalledWith(
        'Cannot process Stack Output: Only supported for AWS provider!',
      );
    });

    it('should display an error if skipping deployment', async () => {
      options.noDeploy = true;

      outputsEnvPlugin = new OutputsEnvPlugin(serverless, options);

      await outputsEnvPlugin.hooks['after:deploy:deploy']();

      expect(serverless.cli.log).toHaveBeenCalledWith(
        'Cannot process Stack Output: Skipping deployment with --noDeploy flag!',
      );
    });

    it('should output the correct data', async () => {
      outputsEnvPlugin = new OutputsEnvPlugin(serverless, options);

      await outputsEnvPlugin.hooks['after:deploy:deploy']();

      expect(tomlify.toToml).toHaveBeenCalledWith({
        ENV_AWS_REGION: 'eu-west-1',
        ENV_CUSTOM_INPUT: 'CUSTOM_INPUT',
        ENV_STAGE: 'test',
      });
    });

    it('should write the file the correct number of times', async () => {
      outputsEnvPlugin = new OutputsEnvPlugin(serverless, options);

      await outputsEnvPlugin.hooks['after:deploy:deploy']();

      expect(writeFile).toHaveBeenCalledTimes(2);
    });
  });

  describe('with a stack name defined', () => {
    beforeEach(() => {
      serverless.service.provider.stackName = 'custom-stack-name';
    });

    it('should throw an error if service is not provided', async () => {
      delete serverless.service;

      outputsEnvPlugin = new OutputsEnvPlugin(serverless, options);

      await outputsEnvPlugin.hooks['after:deploy:deploy']();

      expect(serverless.cli.log).toHaveBeenCalledWith(
        'Cannot process Stack Output: Invalid serverless configuration!',
      );
    });

    it('should throw an error if no provider is set', async () => {
      delete serverless.service.provider;

      outputsEnvPlugin = new OutputsEnvPlugin(serverless, options);

      await outputsEnvPlugin.hooks['after:deploy:deploy']();

      expect(serverless.cli.log).toHaveBeenCalledWith(
        'Cannot process Stack Output: Invalid serverless configuration!',
      );
    });

    it('should throw an error if provider is not AWS', async () => {
      serverless.service.provider.name = 'Azure';

      outputsEnvPlugin = new OutputsEnvPlugin(serverless, options);

      await outputsEnvPlugin.hooks['after:deploy:deploy']();

      expect(serverless.cli.log).toHaveBeenCalledWith(
        'Cannot process Stack Output: Only supported for AWS provider!',
      );
    });

    it('should display an error if skipping deployment', async () => {
      options.noDeploy = true;

      outputsEnvPlugin = new OutputsEnvPlugin(serverless, options);

      await outputsEnvPlugin.hooks['after:deploy:deploy']();

      expect(serverless.cli.log).toHaveBeenCalledWith(
        'Cannot process Stack Output: Skipping deployment with --noDeploy flag!',
      );
    });

    it('should output the correct data', async () => {
      outputsEnvPlugin = new OutputsEnvPlugin(serverless, options);

      await outputsEnvPlugin.hooks['after:deploy:deploy']();

      expect(tomlify.toToml).toHaveBeenCalledWith({
        ENV_AWS_REGION: 'eu-west-1',
        ENV_CUSTOM_INPUT: 'CUSTOM_INPUT',
        ENV_STAGE: 'test',
      });
    });

    it('should write the file the correct number of times', async () => {
      outputsEnvPlugin = new OutputsEnvPlugin(serverless, options);

      await outputsEnvPlugin.hooks['after:deploy:deploy']();

      expect(writeFile).toHaveBeenCalledTimes(2);
    });
  });
});
