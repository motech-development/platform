/* eslint-disable global-require */
import { defineConfig } from 'cypress';

export default defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 20000,
  e2e: {
    baseUrl: 'http://localhost:3000',
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins')(on, config);
    },
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
  projectId: 'Accounts',
});
