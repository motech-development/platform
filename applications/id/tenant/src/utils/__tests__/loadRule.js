const loadRule = require('../loadRule');

jest.mock('istanbul-lib-instrument', () => ({
  createInstrumenter: jest.fn().mockReturnValue({
    instrument: jest.fn((_, __, callback) =>
      callback('Something has gone wrong.'),
    ),
  }),
}));

describe('loadRule', () => {
  let rule;

  beforeEach(() => {
    rule = loadRule('./src/rules/force-email-verification.js', {
      accessToken: 'access-token',
      domain: 'https://test.com',
    });
  });

  it('should throw an error if code cannot be instrumented', async () => {
    await expect(rule).rejects.toThrow('Something has gone wrong.');
  });
});
