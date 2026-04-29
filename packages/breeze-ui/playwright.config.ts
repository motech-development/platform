import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.STORYBOOK_PORT ?? 6006);
const host = process.env.STORYBOOK_HOST ?? '127.0.0.1';
const storybookUrl = process.env.STORYBOOK_URL ?? `http://${host}:${port}`;
const storybookOutputDir =
  process.env.STORYBOOK_OUTPUT_DIR ??
  join(tmpdir(), 'breeze-ui-storybook-static');

export default defineConfig({
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.001,
    },
  },
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
  reporter: process.env.CI ? 'github' : 'html',
  retries: process.env.CI ? 2 : 0,
  snapshotPathTemplate:
    '{testDir}/__screenshots__/{projectName}/{testFilePath}/{arg}{ext}',
  testDir: './visual-tests',
  testMatch: /.*\.visual\.ts/,
  use: {
    baseURL: storybookUrl,
    trace: 'on-first-retry',
  },
  webServer: process.env.STORYBOOK_URL
    ? undefined
    : {
        command: `node visual-tests/serve-storybook.mjs --host ${host} --port ${port}`,
        env: {
          ...process.env,
          STORYBOOK_OUTPUT_DIR: storybookOutputDir,
        },
        reuseExistingServer: !process.env.CI,
        url: storybookUrl,
      },
  workers: process.env.CI ? 1 : undefined,
});
