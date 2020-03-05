import { Options } from 'serverless';
import OutputsEnvPlugin, { IServerlessInstance } from '../outputs-env-plugin';

describe('OutputsEnvPlugin', () => {
  let options: Options;
  let outputsEnvPlugin: OutputsEnvPlugin;
  let serverless: IServerlessInstance;

  beforeEach(() => {
    options = {
      region: 'eu-west-1',
      stage: 'test',
    };
    serverless = {
      cli: {
        log: jest.fn(),
      },
      getProvider: jest.fn(),
      service: {
        custom: {
          outputs: {
            env: {
              AWS_REGION: options.region as string,
              CUSTOM_INPUT: 'CUSTOM_INPUT',
              STAGE: options.region as string,
            },
            files: [],
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

    it.todo('should write the correct file');

    it.todo('should write the file the correct number of times');
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

    it.todo('should write the correct file');

    it.todo('should write the file the correct number of times');
  });
});
