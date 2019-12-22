const { resolve } = require('path');

module.exports = function override(config) {
  config.resolve.alias = {
    'react-router-dom': resolve('node_modules/react-router-dom'),
  };

  return config;
};
