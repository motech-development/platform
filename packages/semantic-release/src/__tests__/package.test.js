const pkg = require('../package');

describe('package', () => {
  it('should have the correct config', () => {
    expect(pkg).toMatchSnapshot();
  });
});
