const { resolve } = require('path');
const rewireStyledComponents = require('react-app-rewire-styled-components');
const pkg = require('./package.json');

module.exports = function override(config, env) {
  let updated = {
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

  updated = rewireStyledComponents(updated, env, {
    displayName: true,
    minify: true,
    pure: true,
    ssr: false,
    transpileTemplateLiterals: true,
  });

  return updated;
};
