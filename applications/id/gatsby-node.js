const { resolve } = require('path');
const pkg = require('./package.json');

exports.onCreateWebpackConfig = ({ actions, getConfig }) => {
  const config = getConfig();

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

  config.resolve.alias = {
    ...config.resolve.alias,
    ...dependencies,
  };

  actions.replaceWebpackConfig(config);
};
