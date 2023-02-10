const application = require('../application');

describe('application', () => {
  it('should have the correct config', () => {
    expect(application).toMatchSnapshot();
  });
});
