import env from '../env';

describe('env', () => {
  let processEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    processEnv = {
      ...process.env,
    };

    process.env.MY_VAR = 'my var';
  });

  afterEach(() => {
    process.env = processEnv;
  });

  it('should throw an error if env var does not exist', () => {
    expect(() => {
      env('FAKE_ENV');
    }).toThrow('Environment variable FAKE_ENV not found');
  });

  it('should return the env var value', () => {
    expect(env('MY_VAR')).toEqual('my var');
  });
});
