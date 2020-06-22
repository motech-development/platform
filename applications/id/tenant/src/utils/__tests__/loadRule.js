const loadRule = require('../loadRule');

describe('loadRule', () => {
  let rule;

  beforeEach(() => {
    rule = loadRule('./src/rules/force-email-verification.js', {
      accessToken: 'access-token',
      domain: 'https://test.com',
    });
  });

  it('should run if there is not coverage', async () => {
    await expect(rule).resolves.toBeDefined();
  });

  it.todo('should throw an error if code cannot be instrumented');
});
