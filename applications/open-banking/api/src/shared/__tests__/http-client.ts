import { SSM } from 'aws-sdk';
import MockAdapter from 'axios-mock-adapter';
import httpClient from '../http-client';

describe('http-client', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(httpClient);

    mock.onGet().reply(200);
    mock.onPost().reply(400);

    SSM.prototype.getParameter = jest.fn();
  });

  it('should throw if no params set', async () => {
    await expect(httpClient.get('/test')).rejects.toThrow('No params passed');
  });

  describe('when params are set', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.YapilyCredentials = 'Something';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should throw if no credentials are found', async () => {
      (SSM.prototype.getParameter as jest.Mock).mockReturnValue({
        promise: jest.fn().mockResolvedValue({
          Parameter: {},
        }),
      });

      await expect(httpClient.get('/test')).rejects.toThrow(
        'No credentials found',
      );
    });

    it('should throw if no credentials are set', async () => {
      (SSM.prototype.getParameter as jest.Mock).mockReturnValue({
        promise: jest.fn().mockResolvedValue({
          Parameter: {
            Value: 'key',
          },
        }),
      });

      await expect(httpClient.get('/test')).rejects.toThrow(
        'No credentials set',
      );
    });

    describe('with the correct secrets', () => {
      beforeEach(() => {
        (SSM.prototype.getParameter as jest.Mock).mockReturnValue({
          promise: jest.fn().mockResolvedValue({
            Parameter: {
              Value: 'key,secret',
            },
          }),
        });
      });

      it('should call SSM with the correct values', async () => {
        await httpClient.get('/test');

        expect(SSM.prototype.getParameter).toHaveBeenCalledWith({
          Name: 'Something',
        });
      });

      it('should attach the basic auth header to any requests', async () => {
        const buffer = Buffer.from(`key:secret`).toString('base64');

        const { config } = await httpClient.get('/test');

        expect(config.headers.Authorization).toEqual(`Basic ${buffer}`);
      });

      it('should have the correct base url', async () => {
        const { config } = await httpClient.get('/test');

        expect(config.baseURL).toEqual('https://api.yapily.com');
      });

      it('should handle errors', async () => {
        await expect(httpClient.post('/test')).rejects.toThrow();
      });
    });
  });
});
