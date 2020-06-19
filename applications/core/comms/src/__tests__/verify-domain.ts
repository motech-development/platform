describe('verify-domain', () => {
  let env: NodeJS.ProcessEnv;

  beforeEach(() => {
    env = {
      ...process.env,
    };

    process.env.AWS_REGION = 'eu-west-2';
  });

  afterEach(() => {
    process.env = env;
  });

  it.todo('should fail if properties are invalid');

  it.todo('should fail if request type is unrecognised');

  it.todo('should validate on create');

  it.todo('should validate on update');

  it.todo('should remove domain on delete');
});
