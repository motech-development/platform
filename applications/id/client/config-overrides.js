const { resolve } = require('path');
const pkg = require('./package.json');

module.exports = function override(config, env) {
  const updated = {
    ...config,
  };
  const dependencies = Object.keys({
    ...pkg.dependencies,
    ...pkg.devDependencies,
  }).reduce((current, item) => {
    const object = {
      ...current,
    };

    object[item] = resolve(`node_modules/${item}`);

    return object;
  }, {});

  updated.resolve.alias = dependencies;

  return updated;
};
