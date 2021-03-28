const { resolve } = require('path');
const { GenerateSW } = require('workbox-webpack-plugin');
const pkg = require('./package.json');

module.exports = function override(config) {
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

  updated.plugins = config.plugins.map((plugin) => {
    if (plugin.constructor.name === 'GenerateSW') {
      return new GenerateSW({
        clientsClaim: true,
        exclude: [/\.map$/, /asset-manifest\.json$/],
        importWorkboxFrom: 'cdn',
        navigateFallback: 'index.html',
        navigateFallbackBlacklist: [
          new RegExp('^/_'),
          new RegExp('/[^/?]+\\.[^/]+$'),
        ],
        offlineGoogleAnalytics: true,
        runtimeCaching: [
          {
            handler: 'NetworkFirst',
            options: {
              cacheName: 'i18n',
            },
            urlPattern: /locales.*\.json$/,
          },
          {
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'fonts',
              expiration: {
                maxEntries: 20,
              },
            },
            urlPattern: /^https:\/\/fonts.(googleapis|gstatic).com/,
          },
          {
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'avatar',
              expiration: {
                maxEntries: 5,
              },
            },
            urlPattern: /^https:\/\/?[^/:]+\/.*?avatar(?:s)/,
          },
        ],
      });
    }

    return plugin;
  });

  return updated;
};
