/* eslint-disable no-underscore-dangle */
const rewire = require('rewire');

const requireWithVersionSupport = moduleName => {
  const name = moduleName.split('@')[0];

  // eslint-disable-next-line import/no-dynamic-require
  return require(name);
};

const loadRule = (location, auth0 = {}) => {
  const module = rewire(location);

  module.__set__({
    UnauthorizedError: Error,
    auth0,
    require: requireWithVersionSupport,
  });

  return module.__get__;
};

module.exports = loadRule;
