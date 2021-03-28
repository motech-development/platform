import isProd from '../isProd';

describe('isProd', () => {
  let env: NodeJS.ProcessEnv;

  beforeEach(() => {
    env = {
      ...process.env,
    };
  });

  afterEach(() => {
    process.env = env;
  });

  it('should return the correct value is production environment', () => {
    process.env['NODE_ENV' as string] = 'production';

    const result = isProd('Prod', 'Not prod');

    expect(result).toEqual('Prod');
  });

  it('should return the correct value is not production environment', () => {
    const result = isProd('Prod', 'Not prod');

    expect(result).toEqual('Not prod');
  });
});
