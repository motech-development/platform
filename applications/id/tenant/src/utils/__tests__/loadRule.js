const instrument = require('istanbul-lib-instrument');

vi.spyOn(instrument, 'createInstrumenter').mockReturnValue({
  instrument: vi.fn((_, __, callback) => callback('Something has gone wrong.')),
});

const loadRule = require('../loadRule');

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
