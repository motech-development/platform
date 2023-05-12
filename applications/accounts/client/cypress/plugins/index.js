/* eslint-disable no-console */
/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const logToOutput = require('cypress-log-to-output');
const { rmdirSync } = require('node:fs');
const { join } = require('node:path');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  const downloads = join(__dirname, '../downloads');

  logToOutput.install(
    () => {},
    (_, event) => {
      const levels = ['error', 'warn'];

      return levels.includes(event.level) || levels.includes(event.type);
    },
  );

  on('before:browser:launch', (browser, launchOptions) => {
    const updatedLaunchOptions = {
      ...launchOptions,
    };

    updatedLaunchOptions.args = logToOutput.browserLaunchHandler(
      browser,
      launchOptions.args,
    );

    if (browser.family === 'chromium') {
      updatedLaunchOptions.preferences.default.download = {
        default_directory: downloads,
      };
    }

    return updatedLaunchOptions;
  });

  on('task', {
    clearDownloads: () => {
      rmdirSync(downloads, {
        recursive: true,
      });

      return null;
    },
    log(message) {
      console.log(message);

      return null;
    },
    table(message) {
      console.table(message);

      return null;
    },
  });
};
