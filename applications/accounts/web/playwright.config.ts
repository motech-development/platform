import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, devices } from '@playwright/test';

const localEnvironment = resolve('.env.local');

if (existsSync(localEnvironment)) {
  process.loadEnvFile(localEnvironment);
}

export default defineConfig({
  forbidOnly: Boolean(process.env.CI),
  outputDir: 'playwright/results',
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      dependencies: ['setup'],
      name: 'chromium',
      testMatch: /(?:foundation|vat-registered)\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: resolve('playwright/.auth/user.json'),
      },
    },
    {
      dependencies: ['setup'],
      name: 'mobile-chromium',
      testMatch: /foundation\.spec\.ts/,
      use: {
        ...devices['Pixel 5'],
        storageState: resolve('playwright/.auth/user.json'),
      },
    },
  ],
  reporter: process.env.CI ? 'github' : 'list',
  testDir: './e2e',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
  },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'yarn build && yarn serve --host 127.0.0.1',
        reuseExistingServer: !process.env.CI,
        url: 'http://127.0.0.1:3000',
      },
});
