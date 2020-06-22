/* eslint-disable no-underscore-dangle, import/no-dynamic-require */
const rewire = require('rewire');

const requireWithVersionSupport = moduleName => {
  const name = moduleName.split('@')[0];

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
